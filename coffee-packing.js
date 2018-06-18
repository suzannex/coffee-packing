// Slurp Developer Assignment


// idea from last night:
// back to the filling rows idea
// track the next x for a current y to fill
//  and also track the next y to fill
// this is  all for a current z
// then when x and y are no longer fillable
// change the z


/*
Classes:

Bag
- dimensions
- volume (func or prop)

Box
- dimension
- list of bags it has? don't need maybe
..brainstorming how to store fullness info...
- 2d array of heights of stacked material at each cc
=>> ok that's not scalable, or at least is not efficient to search over
=>> but honestly, just start with the slow solution b/c at least it's something
=>> Invariant: at any point x,y in arr, all points <x or <y have = or greater heights.
- list of bags/orientations and bottom left corner coords
*/

// make a 2d array with dim rows and columns, with all values init to 0
function emptyArray(dim) {
  var arr = new Array(dim);
  for (let i = 0; i < dim; i++) {
    row = new Array(dim);
    for (let j = 0; j < dim; j++) { row[j] = 0; }
    arr[i] = row;
  }
  return arr;
  // or:
  //return new Array(dim).fill(new Array(dim).fill(0));
}

// print the 2d array nicely
function printArray(arr, size) {
  let arrStr = ""
  for (let i = 0; i < size; i++) {
    let rowStr = ""
    for (let j = 0; j < size; j++) {
      rowStr += arr[i][j] + " "
    }
    arrStr = rowStr +  "\n" + arrStr
  }
  console.log(arrStr)
}

// ----------------------------------------------------------------------------

class Bag {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static newSmallBag() { return new Bag(2, 16, 23); }
  static newMedBag() { return new Bag(2, 22, 26); }
  static newLargeBag() { return new Bag(10, 14, 26); }

  getX() { return this.x; }
  getY() { return this.y; }
  getZ() { return this.z; }

  getVolume() { return this.x * this.y * this.z; }

  // rotate the bag
}

// ----------------------------------------------------------------------------

class Box {
  constructor(dimension) {
    this.dimension = dimension;
    this.bags = [];
    this.heights = emptyArray(dimension);
  }

  // add a bag to the heights array and the bag to the bags array,
  // or return false if the bag can't fit in this box
  addBag(bag) {
    // add the bag at the first cell it will fit in
    for (let row = 0; row < this.dimension; row++) { // row idx is x pos
      for (let col = 0; col < this.dimension; col++) { // col idx is y pos
        let cell = this.heights[row][col];

        // if the bag is short enough to fit here, add it
        if (this.doesBagFit(bag, row, col, cell)) {
          // prnt this.heights to see if it changed
          console.log("occ vol before adding bag: " + this.getOccupiedVolume());
          this.updateHeights(row + bag.getX(), col + bag.getY(), cell + bag.getZ())
          console.log("occ vol after adding bag: " + this.getOccupiedVolume());

          this.bags = this.bags.concat(bag);
          return true;
        }
      }
    }
    return false;
  }

  // If placed at this x,y,z location in the box,
  // would the bag fit?
  doesBagFit(bag, x, y, z) {
    let xFits = (x + bag.getX()) <= this.dimension;
    let yFits = (y + bag.getY()) <= this.dimension;
    let zFits = (z + bag.getZ()) <= this.dimension;
    return xFits && yFits && zFits;
  }

  // From 0,0 to x,y, set all heights in the array to at least
  // the value of height
  updateHeights(x, y, height) {
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        //console.log(i + " " + j);
        //console.log(this.heights[i][j]);
        this.heights[i][j] = Math.max(height, this.heights[i][j]);
      }
    }
  }

  // Calculate the volume of this box that is used up by coffee bags
  getOccupiedVolume() {
    let sum = 0;
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        sum += this.heights[i][j];
      }
    }
    return sum;
    // const rowReducer = (totalVolume, arr) => ( arr.reduce(innerReducer,0) + totalVolume )
    // const innerReducer = (totalVol, cellVol) => ( cellVol + totalVol )
    // return this.heights.reduce(rowReducer);
  }


}

// ----------------------------------------------------------------------------

// given #s of each size bags and size of box,
// determine # of boxes needed to hold all bags
// int, int, int, int => int
function packBoxes(small, med, large, boxDimension) {
  var boxes = [new Box(boxDimension)]
  // add the large bags
  for (var i = 0; i < large; i++) {
    boxes = addBagToBoxes(Bag.newLargeBag(), boxes, boxDimension)
  }
  // add the medium bags
  for (var i = 0; i < med; i++) {
    boxes = addBagToBoxes(Bag.newMedBag(), boxes, boxDimension)
  }
  // add the small bags
  for (var i = 0; i < small; i++) {
    boxes = addBagToBoxes(Bag.newSmallBag(), boxes, boxDimension)
  }
  return boxes;
}

// Try to fit the bag into some box in the array.
// if it fits in none, make new box and add it to array.
// Return the array of boxes containing the bag
function addBagToBoxes(bag, boxes, boxDimension) {
  // put the bag into the first box it will fit in.
  for (let box of boxes) {
    if (box.addBag(bag)) {
      return boxes;
    }
  }
  // if it didn't fit into any of the boxes, add another box for the bag.
  var anotherBox = new Box(boxDimension);
  anotherBox.addBag(bag);
  return boxes.concat(anotherBox);
}



// read in args
// set values: size of box, # of each size bag
// program var: array of boxes, init to 1 box w/ right dimensions.

var args = process.argv;
var boxes = packBoxes(args[2], args[3], args[4], args[5]);
var numBoxes = boxes.length;
console.log(numBoxes);
const actualVolume = boxes[0].bags.reduce((acc, bag) => (acc + bag.getVolume()), 0);
console.log("actual volume: " + actualVolume);
console.log(boxes[0].bags);
printArray(boxes[0].heights, boxes[0].dimension);
