// Slurp Developer Assignment

/*
This file contains the following sections:
1. Util functions
2. Classes
3. Main functions
*/

// ----------------------------------------------------------------------------
// UTILS

// Make a 2d array with dim rows and columns, with all values init to 0
function generateZeroHeightArray(dim) {
  var arr = new Array(dim);
  for (let i = 0; i < dim; i++) {
    row = new Array(dim);
    for (let j = 0; j < dim; j++) { row[j] = 0; }
    arr[i] = row;
  }
  return arr;
}

// ** Used to verify results in testing **
// Print the 2d array nicely
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

// Create array of all 6 permutations of the 3 elements
function permutations(a, b, c) {
  return [[a, b, c], [a, c, b], [b, a, c], [b, c, a], [c, a, b], [c, b, a]];
}



// ----------------------------------------------------------------------------
// CLASSES

class Bag {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  getX() { return this.x; }
  getY() { return this.y; }
  getZ() { return this.z; }
  getVolume() { return this.x * this.y * this.z; }

  // return array of all possible orientations of a bag with the given dimensions
  static allBags(x, y, z) {
    const perms = permutations(x, y, z);
    let bags = []
    for (let perm of perms) {
      bags = bags.concat(new Bag(perm[0], perm[1], perm[2]));
    }
    return bags;
  }
}

class Box {
  /* Instance variables:
    dimension : the side length of this Box in centimeters
    bags : a list of all the Bags that have been added to this Box
    heights : a 2D array of integers representing a top view of the bags
       in this Box, with each value representing the total height of
       stacked Bags at that 1cm by 1cm location.   */
  constructor(dimension) {
    this.dimension = dimension;
    this.bags = [];
    this.heights = generateZeroHeightArray(dimension);
  }

  // Given an array with the 6 possible x-y-z orientations of a coffee bag,
  // determine if the bag will fit in this Box. If so, add it to this box.
  // If not, return false to indicate that the bag does not fit.
  // @bags -- an array of Bag objects with dimensions in different orientations
  addBag(bags) {
    // add the bag at the first x,y,z location it will fit in
    for (let row = 0; row < this.dimension; row++) { // row idx is x position
      for (let col = 0; col < this.dimension; col++) { // col idx is y position
        let height = this.heights[row][col];
        // try adding the bag at different orientations until it fits
        for (let bag of bags) {
          if (this.doesBagFit(bag, row, col, height)) {
            // prnt this.heights to see if it changed
            console.log("occ vol before adding bag: " + this.getOccupiedVolume());
            this.updateHeights(row + bag.getX(), col + bag.getY(), height + bag.getZ())
            console.log("occ vol after adding bag: " + this.getOccupiedVolume());

            this.bags = this.bags.concat(bag);
            return true;
          }
        }
      }
    }
    return false;
  }

  // Does the bag fit in this box if placed at the given x,y,z location?
  // @bag -- a Bag
  // @x, @y, @z -- coordinates in the box (in centimenters)
  doesBagFit(bag, x, y, z) {
    let xFits = (x + bag.getX()) <= this.dimension;
    let yFits = (y + bag.getY()) <= this.dimension;
    let zFits = (z + bag.getZ()) <= this.dimension;
    return xFits && yFits && zFits;
  }

  // From 0,0 to x,y, set all heights in the array to at least
  // as tall as height.
  // @x, @y -- coordinates in the box (in cm)
  // @height -- the new height
  updateHeights(x, y, height) {
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        //console.log(i + " " + j);
        //console.log(this.heights[i][j]);
        this.heights[i][j] = Math.max(height, this.heights[i][j]);
      }
    }
  }

  // ** This function is just for use in testing. **
  // Calculate the volume of this box that is recorded as occupied
  // in the heights array. (sums all numbers in the array)
  getOccupiedVolume() {
    /* outerReducer: combine the sums of each inner array in the 2d array */
    const outerReducer = (totalVolume, row) => ( row.reduce(innerReducer,0) + totalVolume )
    /* innerReducer: add all the numbers in an array */
    const innerReducer = (totalVol, cell) => ( cell + totalVol )
    return this.heights.reduce(outerReducer,0);
  }


}

// ----------------------------------------------------------------------------
// MAIN FUNCTIONS

// CONSTANTS -- The bags
// Arrays of bags in all 6 orientations
const smallBags = Bag.allBags(23, 16, 2);
const medBags = Bag.allBags(26, 22, 2);
const largeBags = Bag.allBags(26, 14, 10);

// Use this function to run the program.
// Validates inputs then runs the algorithm.
// int, int, int, int => int
function main(small, med, large, boxDimension) {
  let errorMsg = validateArgs(small, med, large, boxDimension);
  if (errorMsg !== false) {
    return "Invalid input: " + errorMsg;
  } else {
    return packBoxes(small, med, large, boxDimension).length;
  }
}

// given quantities of each size of bag and the size of the box,
// determine # of boxes needed to hold all bags
// int, int, int, int => array of Box
function packBoxes(small, med, large, boxDimension) {
  var boxes = []
  // add the large bags
  for (var i = 0; i < large; i++) {
    boxes = addBagToBoxes(largeBags, boxes, boxDimension)
  }
  // add the medium bags
  for (var i = 0; i < med; i++) {
    boxes = addBagToBoxes(medBags, boxes, boxDimension)
  }
  // add the small bags
  for (var i = 0; i < small; i++) {
    boxes = addBagToBoxes(smallBags, boxes, boxDimension)
  }
  return boxes;
}

// ** Helper function for packBoxes **
// Try to fit the bag into some box in the box array.
// If it fits in none, make new box and add it to array.
// Return the array of boxes that contains the bag
function addBagToBoxes(bags, boxes, boxDimension) {
  for (let box of boxes) {
    if (box.addBag(bags)) {
      return boxes;
    }
  }
  // add new box for the bag if it didn't fit in any existing box
  var anotherBox = new Box(boxDimension);
  anotherBox.addBag(bags);
  return boxes.concat(anotherBox);
}

// ** Helper function for main function **
// Validate program arguments + argument types
function validateArgs(small, med, large, boxDimension) {
  let errorMsg = false;
  if (!Number.isInteger(parseInt(small))) {
    errorMsg = "non-integer argument: " + small + " ("  + typeof small + ")";
  } else if (!Number.isInteger(parseInt(med))) {
    errorMsg = "non-integer argument: " + med + " ("  + typeof med + ")";
  } else if (!Number.isInteger(parseInt(large))) {
    errorMsg = "non-integer argument: " + large + " ("  + typeof large + ")";
  } else if (!Number.isInteger(parseInt(boxDimension))) {
    errorMsg = "non-integer argument: " + boxDimension + " ("  + typeof boxDimension + ")";
  } else if (small < 0) {
    errorMsg = "number of 200g bags is less than 0: " + small;
  } else if (med < 0) {
    errorMsg = "number of 400g bags is less than 0: " + med;
  } else if (large < 0) {
    errorMsg = "number of 1000g bags is less than 0: " + large;
  } else if (!(boxDimension >= 30 && boxDimension <= 100)) {
    errorMsg = "box dimension is not between 30 and 100 cm: " + boxDimension;
  }
  return errorMsg;
}

// Used for running the program from the command line
var args = process.argv;
var result = main(args[2], args[3], args[4], args[5]);
console.log(result);
