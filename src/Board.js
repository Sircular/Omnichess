/* Represents the board state at a point in time */
class Board 
{
	constructor(adjacencyMatrix)
	{
		this.cells = adjacencyMatrix;
		/* The below works because we insist on a square/cubic grid */
		this.dimensions = Math.round(Math.log(adjacencyMatrix[0].length) / Math.log(3));
		this.contents = [];
		
		/* Has an extra cell (0), but will never be used, and makes stuff line up */
		for (let i = 0; i <= this.cells.length; i++)
		{
			this.contents.push(undefined);
		}
	}
	
	/**
	 *  Returns a Set of all locations (as indices) described
	 *  by the vector relative to startLocation. Does not account
	 *  for a blocked destination, since this could be used for
	 *  capture, but it will not continue down a blocked path.
	 *  
	 *  Always returns an array. Returns an empty array if no such
	 *  locations can be found. 
	 */
	GetCellIndices(vector, startLocation, includeCaptureEligible = false, enforceCaptureEligible = false)
	{
		const allCellIndices = new Set();
		
		const maxRepetitions = vector.components.reduce((maximum, currComp) => {
			return Math.max(maximum, currComp.maxRep);
		}, 1);
		
		for (let i = 1; i <= maxRepetitions; i++)
		{
			const output = this.GetPathOutput(startLocation, vector.components, i);

			if (output === null || output <= 0 || 
				(this.contents[output] !== undefined && !includeCaptureEligible) || 
				(this.contents[output] === undefined && enforceCaptureEligible))
			{
				continue;
			}
			if (this.contents[output] !== undefined && enforceCaptureEligible)
			{
				allCellIndices.add(output);
				continue;
			}
			allCellIndices.add(output);
		}
		
		/* Convert set to array */
		return [...allCellIndices];
	}
	
	/**
	 *  Returns the index of the cell found by following
	 *  the components for the passed number of iterations.
	 *  Returns null if it goes off the board, or cannot find
	 *  a valid path (such as being obstructed).
	 */
	GetPathOutput(start, components, iterations)
	{
		let destCell = start;
		let prevCell = start;
		const deltas = [];
		components.forEach((component, index) => {
			deltas.push(component.length * Math.min(iterations, component.maxRep));
		});

		while (deltas.reduce((total, current) => total + Math.abs(current), 0) !== 0)
		{
			const steps = deltas.map((element) => Math.sign(element));
			deltas.forEach((delta, index) => {
				deltas[index] -= steps[index];
			});
			
			// Note: this might need to use steps.reverse() to get dimensionality ordered
			const direction = MatrixUtilities.VectorToDirection(steps);
			prevCell = destCell;
			destCell = this.cells[destCell - 1][direction];
			if (destCell === null || destCell <= 0)
			{
				break;
			}
			
			/* Stop iterating when we hit an occupied square, unless jump or hop */
			if (this.contents[destCell] !== undefined)
			{
				let canHopObstacle = false;
				components.forEach((component, index) => {
					if ((component.jump || component.hop) && deltas[index] !== 0)
						canHopObstacle = true;
				});
				if (canHopObstacle) continue;
				break;
			}
		}
		
		/* If hop, only output when previous cell is occupied */
		let hop = false;
		components.forEach((component) => {
			if (component.hop) hop = true;
		});
		if (hop && this.contents[prevCell] === undefined)
		{
			return null;
		}
		
		return destCell;
	}
	
	/**
	 * Produces a two-dimensional array. Each cell represents a visible slot on the board.
	 * Where these cells are not included in the board, they contain -1. Otherwise, they
	 * contain the index of the cell they represent.
	 */
	ConvertToArray()
	{
		if (this.cells.length === 0)
		{
			return MatrixUtilities.GetEmptyMatrix(this.dimensions);
		}

		const outputBoard = MatrixUtilities.GetEmptyMatrix(this.dimensions);
		const cellsToAdd = [];
		
		/* Create space for first cell, from which to create the rest of the board */
		MatrixUtilities.InsertHyperplaneInMatrix(0, -1, outputBoard, 2);
		
		/* Use the center direction to correctly get sign of first cell */
		const firstCell = this.cells[0][(Math.pow(3, this.dimensions) - 1) / 2]
		let root = outputBoard;
		for (let i = 1; i < this.dimensions; i++)
		{
			root = root[0];
		}
		root[0] = firstCell;
		
		cellsToAdd.push(...this.Expand(firstCell, outputBoard, MatrixUtilities.GetCoordinates(firstCell, outputBoard, this.dimensions)));
		while (cellsToAdd.length > 0)
		{
			const index = cellsToAdd.shift();
			const coords = MatrixUtilities.GetCoordinates(index, outputBoard, this.dimensions);
			cellsToAdd.push(...this.Expand(Math.abs(index), outputBoard, coords));
		}

		return outputBoard;
	}
	
	Expand(index, matrix, coordinates)
	{
		const neighbors = this.cells[index - 1];
		const cellsAdded = [];
		for (let direction = 0; direction < neighbors.length; direction++)
		{
			if (neighbors[direction] === null) /* No neighbor in this direction */
				continue;

			/* Skip over cells that have already been inserted */
			if (MatrixUtilities.GetCoordinates(neighbors[direction], matrix, this.dimensions) !== undefined)
				continue;
			
			const directionVector = MatrixUtilities.DirectionToVector(direction, this.dimensions);
			const lengths = MatrixUtilities.GetLengths(matrix, this.dimensions).reverse();

			/* Widen matrix to make room, if necessary */
			for (let axis = 0; axis < directionVector.length; axis++)
			{
				if (directionVector[axis] === -1 && coordinates[axis] === 0)
				{
					MatrixUtilities.InsertHyperplaneInMatrix(axis, -1, matrix, this.dimensions);
					coordinates[axis] = 1
				}
				if (directionVector[axis] === 1 && coordinates[axis] === lengths[axis] - 1)
				{
					MatrixUtilities.InsertHyperplaneInMatrix(axis, 1, matrix, this.dimensions);
				}
			}
						
			const newCoordinates = directionVector.reverse().map((currentValue, currentIndex) => {
				return currentValue + coordinates[currentIndex];
			});
						
			let insertionPoint = matrix;
			for (let axis = 0; axis < this.dimensions - 1; axis++)
			{
				insertionPoint = insertionPoint[newCoordinates[axis]];
			}
			insertionPoint[newCoordinates[newCoordinates.length - 1]] = neighbors[direction];
			cellsAdded.push(neighbors[direction]);
		}
		
		return cellsAdded;
	}
	
	/**
	 * Generates and returns an adjacency matrix with the lengths specified in dimensions,
	 * an array of integers. Uses a n-dimensional matrix, where n = dimensions.length.
	 */
	static Generate(dimensions)
	{
		const adjacencyMatrix = [];
		const cellCount = ArrayUtilities.ProductOfLastN(dimensions, dimensions.length);
		const directions = Math.pow(3, dimensions.length);
		const centerDirection = (directions - 1) / 2;
		
		/* This loop assumes validity and initalizes the adjacency matrix */
		for (let i = 1; i <= cellCount; i++)
		{
			const matrixIndex = i-1;
			adjacencyMatrix.push([]);
			for (let direction = 0; direction < directions; direction++)
			{
				let totalOffset = 0;
				for (let axis = 0; axis < dimensions.length; axis++)
				{
					const powerOfThree = Math.pow(3, axis);
					const increment = ArrayUtilities.ProductOfLastN(dimensions, axis);
					
					/* Mod (direction divided by (3^axis), rounding up) by 3
					 * If 0, subtract (3^axis) from totalOffset
					 * If 1, direction is centered on axis - leave totalOffset unchanged
					 * If 2, add (3^axis) from totalOffset
					 */
					const magicNumber = Math.floor(direction / powerOfThree) % 3;
					if (magicNumber === 0)
					{
						totalOffset -= increment;
					}
					if (magicNumber === 2)
					{
						totalOffset += increment;
					}
				}
				// console.log("Pushed " + (i + totalOffset) + " in direction " + direction + " of cell " + (i));
				adjacencyMatrix[matrixIndex].push(i + totalOffset);
			}
		}
		
		/* This loop marks invalid directions.
		 * It marks them one dimension at a time,
		 * first marking all negative out of bounds (stepping to a lower index)
		 * and then all positive out of bounds (stepping to a higher index).
		 *
		 * Note that invalids come in contiguous segments of indices based
		 * on which dimension we are operating in.
		 */
		for (let dimension = 0; dimension < dimensions.length; dimension++)
		{
			const segmentLength = ArrayUtilities.ProductOfLastN(dimensions, dimension);
			const distanceBetweenSegments = ArrayUtilities.ProductOfLastN(dimensions, dimension + 1);
			const negativeDirections = MatrixUtilities.GetDirectionsByVector(dimension, 0, dimensions.length);
			const positiveDirections = MatrixUtilities.GetDirectionsByVector(dimension, 2, dimensions.length);

			/* The negative invalids */
			for (let segmentStart = 1; segmentStart <= cellCount; segmentStart += distanceBetweenSegments)
			{
				for (let offset = 0; offset < segmentLength; offset++)
				{
					for (let directionIndex = 0; directionIndex < negativeDirections.length; directionIndex++)
					{
						/* - 1 to convert to matrix indices */
						adjacencyMatrix[segmentStart + offset - 1][negativeDirections[directionIndex]] = null;
					}
				}
			}

			/* The positive invalids */
			for (let segmentStart = (distanceBetweenSegments - segmentLength + 1); segmentStart <= cellCount; segmentStart += distanceBetweenSegments)
			{
				for (let offset = 0; offset < segmentLength; offset++)
				{
					for (let directionIndex = 0; directionIndex < positiveDirections.length; directionIndex++)
					{
						/* - 1 to convert to matrix indices */
						adjacencyMatrix[segmentStart + offset - 1][positiveDirections[directionIndex]] = null;
					}
				}
			}
		}
		
		return adjacencyMatrix;
	}
}
