import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
        image_date: String,
        image_url: String,
        image_uploaded_by: String
})

module.exports = mongoose.models.Image || mongoose.model('Image', imageSchema);