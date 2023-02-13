const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// virtual for full name

AuthorSchema.virtual("name").get(function() {
  // we will make sure to avoid errors when one name is missing
  let fullname = "";
  //this refers to the AuthorSchema
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

// virtual for url

AuthorSchema.virtual("url").get(function() {
  // an id is created automatically when a schema is used
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("lifespan").get(function() {
  let death = DateTime.fromJSDate(this.date_of_death).toLocaleString(
    DateTime.DATE_MED
  );
  let birth = DateTime.fromJSDate(this.date_of_birth).toLocaleString(
    DateTime.DATE_MED
  );
  if (death === "Invalid DateTime") {
    death = "";
  }
  if (birth === "Invalid DateTime") {
    return "Unknown";
  }
  return birth + " - " + death;
});

module.exports = mongoose.model("Author", AuthorSchema);
