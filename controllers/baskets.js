const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// 1. SPECIFIC route first (/new)
router.get('/new', async (req, res) => {
  res.render('baskets/new.ejs');
});

// 2. Shopping List - BEFORE index so it doesn't conflict
router.get('/shopping-list', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    // Collect all items from all baskets
    const allItems = [];
    currentUser.baskets.forEach(basket => {
      if (basket.items) {
        const itemList = basket.items.split(/[•\n]/).map(item => item.trim()).filter(item => item.length > 0);
        itemList.forEach(item => {
          allItems.push({
            item: item,
            basketName: basket.basketName,
            recipient: basket.recipient
          });
        });
      }
    });

    res.render('baskets/shopping-list.ejs', {
      allItems: allItems,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// 3. Index route (/)
router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('baskets/index.ejs', {
      baskets: currentUser.baskets,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// 4. POST route
router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.baskets.push(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/baskets`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// 5. Edit route - specific before :basketId
router.get('/:basketId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const basket = currentUser.baskets.id(req.params.basketId);
    res.render('baskets/edit.ejs', {
      basket: basket,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// 6. PARAMETERIZED routes last
router.put('/:basketId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const basket = currentUser.baskets.id(req.params.basketId);
    basket.set(req.body);
    await currentUser.save();
    res.redirect(
      `/users/${currentUser._id}/baskets/${req.params.basketId}`
    );
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/:basketId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const basket = currentUser.baskets.id(req.params.basketId);
    res.render('baskets/show.ejs', {
      basket: basket,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.delete('/:basketId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.baskets.id(req.params.basketId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/baskets`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;