const express = require("express");
const router = express.Router();

const { isLoggedIn, isAuthor, validateCampground } = require("../middlewares");

// Catch async
const catchAsync = require("../helpers/catchAsync");
// Campground Model
const Campground = require("../models/campground");
// ExpressError
const ExpressError = require("../helpers/ExpressError");

// Joi schemas
const { campgroundSchema } = require("../schemas");

// Campgrounds index
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Add campground form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// Add campground
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Show campground
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate("reviews")
      .populate("author");
    console.log(campground);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

// Edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      res.redirect("/campgrounds");
    }
    res.render(`campgrounds/edit`, { campground });
  })
);

// Edit element
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect(`/campgrounds`);
  })
);

module.exports = router;
