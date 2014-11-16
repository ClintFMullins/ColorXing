var cx = cx || {};
cx.color = {};

cx.color.CIRCLE_DEGREES = 360;
cx.color.INFLUENCE_VELOCITY = 10;

cx.color.getCircleAverage = function(hues) {
  if (!hues.length) {
    throw("cx.color.getCircleAverage given empty array");
  }

  var sortedHues = this.sortedHuesByValue(hues);
  var sortedByDistanceHues = this.sortedHuesByDistance(sortedHues);
  var adjustedHues = this.adjustedHues(sortedByDistanceHues);
  return this.adjustedHuesAverage(adjustedHues);
};

cx.color.getInfluencedHue = function(originalHue, influnceHue) {
  if (originalHue === influnceHue) {
    return parseInt(originalHue);
  }

  var influencedOriginalAdjustedHue;
  var hues = [originalHue, influnceHue];

  var sortedHues = this.sortedHuesByValue(hues);
  var sortedByDistanceHues = this.sortedHuesByDistance(sortedHues);
  var adjustedHues = this.adjustedHues(sortedByDistanceHues);

  if (adjustedHues[0] % this.CIRCLE_DEGREES == originalHue) {
    influencedOriginalAdjustedHue = adjustedHues[0] + this.INFLUENCE_VELOCITY;
    if (influencedOriginalAdjustedHue > adjustedHues[1]) {
      influencedOriginalAdjustedHue = adjustedHues[1];
    }
  } else {
    influencedOriginalAdjustedHue = adjustedHues[1] - this.INFLUENCE_VELOCITY;
    if (influencedOriginalAdjustedHue < adjustedHues[0]) {
      influencedOriginalAdjustedHue = adjustedHues[0];
    }
  }
  return parseInt(influencedOriginalAdjustedHue % this.CIRCLE_DEGREES);
}

cx.color.sortedHuesByValue = function(hues) {
  return hues.sort(function(hue1, hue2) {
    return hue1 - hue2;
  });
};

cx.color.sortedHuesByDistance = function(sortedHues) {
  var distances = [];
  var sortedByDistanceHues = [];

  for (var squareIndex = 1; squareIndex < sortedHues.length; squareIndex++) {
    var distance = sortedHues[squareIndex] - sortedHues[squareIndex - 1];
    distances.push(distance);
  };

  var distanceFromLastToFirst = (this.CIRCLE_DEGREES - sortedHues[sortedHues.length - 1]) + sortedHues[0];
  distances.unshift(distanceFromLastToFirst);

  var maxDistance = Math.max.apply(null, distances);
  var maxDistanceIndex = distances.indexOf(maxDistance);

  var sortedByDistanceHues = sortedHues.slice(maxDistanceIndex, sortedHues.length);
  return sortedByDistanceHues.concat(sortedHues.slice(0, maxDistanceIndex));
};

cx.color.adjustedHues = function(sortedByDistanceHues) {
  var passedZero = false;
  var adjustedHues = sortedByDistanceHues.slice(0);

  for (var index = 1; index < sortedByDistanceHues.length; index++) {
    if (sortedByDistanceHues[index] < sortedByDistanceHues[index - 1]) {
      passedZero = true;
    }

    adjustedHues[index] += passedZero ? this.CIRCLE_DEGREES : 0;
  }

  return adjustedHues;
};

cx.color.adjustedHuesAverage = function(adjustedHues) {
  var averageAdjustedHue = adjustedHues.reduce(function(prev, current) {
    return prev + current;
  }) / adjustedHues.length;

  return parseInt(averageAdjustedHue % this.CIRCLE_DEGREES);
};