const Board  = function () {
  this.entertainmentApis = [14, 10, 11, 12];

    this.subjects = [

    {category: "history",
    apiCode: "0"},
    {category: "geography",
    apiCode: "1"},
    {category: "sports",
    apiCode: "2"},
    {category: "science",
    apiCode: "3"},
    {category: "general-knowledge",
    apiCode: "4"},
    {category: "entertainment",
    apiCode: "5"},
  ];



  this.boardSpaces = {
    0: this.subjects[0],
    1: this.subjects[1],
    2: this.subjects[2],
    3: this.subjects[3],
    4: this.subjects[4],
    5: this.subjects[5],
    6: this.subjects[2],
    7: this.subjects[3],
    8: this.subjects[4],
    9: this.subjects[5],
    10: this.subjects[0],
    11: this.subjects[1],
    12: this.subjects[3],
    13: this.subjects[4],
    14: this.subjects[5],
    15: this.subjects[0],
    16: this.subjects[1],
    17: this.subjects[2],
    18: this.subjects[4],
    19: this.subjects[5],
    20: this.subjects[0],
    21: this.subjects[1],
    22: this.subjects[2],
    23: this.subjects[3],
    24: this.subjects[5],
    25: this.subjects[0],
    26: this.subjects[1],
    27: this.subjects[2],
    28: this.subjects[3],
    29: this.subjects[4]
  };
}

module.exports = Board;
