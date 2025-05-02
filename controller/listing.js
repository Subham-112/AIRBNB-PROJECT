const Listing = require('../Models/listing');

module.exports.index = async (req, res) => {
    let allLists = await Listing.find({});
    res.render("listings/index.ejs", { allLists });
}

module.exports.newListing = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    
    if(!listing) {
        req.flash("error", "Listing you looking for isn't exist");
        return res.redirect("/allLists")
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const lists = new Listing(req.body.listings);
    lists.owner = req.user._id;
    lists.image = {url, filename};
    await lists.save();
    req.flash("success", "Listing added");
    res.redirect("/allLists");
}

module.exports.editListing = async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you looking for isn't exist");
        return res.redirect("/allLists")
    }
    let originalImage = listing.image.url;
    let modifyUrl = originalImage.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, modifyUrl });
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings });

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save();
    }
    
    req.flash("success", "Listing updated");
    res.redirect(`/allLists/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/allLists");
}