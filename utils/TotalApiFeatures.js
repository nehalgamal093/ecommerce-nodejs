export class TotalApiFeatures {
  constructor(totalQuery, totalquerystring) {
    this.totalQuery = totalQuery;
    this.totalquerystring = totalquerystring;
  }

  filter() {
    //2- filter
    let filterObj = { ...this.totalquerystring };
    let excludedQuery = ["page", "sort", "fields", "keyword"];
    excludedQuery.forEach((q) => {
      delete filterObj[q];
    });
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    filterObj = JSON.parse(filterObj);

    this.totalQuery = this.totalQuery.find(filterObj);
    return this;
  }

  //3- sort
  sort() {
    if (this.totalquerystring.sort) {
      let sortedBy = this.totalquerystring.sort.split(",").join(" ");
      this.totalQuery = this.totalQuery.sort(sortedBy);
    }
    return this;
  }

  //4-search
  search() {
    if (this.totalquerystring.keyword) {
      this.totalQuery = this.totalQuery.find({
        $or: [
          { title: { $regex: this.totalquerystring.keyword, $options: "i" } },
          {
            description: {
              $regex: this.totalquerystring.keyword,
              $options: "i",
            },
          },
        ],
      });
    }
    return this;
  }
  //5- select fields
  fields() {
    if (this.totalquerystring.fields) {
      let fields = this.totalquerystring.fields.split(",").join(" ");
      this.totalQuery = this.totalQuery.select(fields);
    }
    return this;
  }
}
