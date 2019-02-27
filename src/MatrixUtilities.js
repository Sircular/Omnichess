class MatrixUtilities
{
	static GetDirectionsByVector(vectorAxis, vectorSign, dimensions)
	{
		const directions = [];
		for (let direction = 0; direction < Math.pow(3, dimensions); direction++)
		{
			const vector = [];
			for (let axis = 0; axis < dimensions; axis++)
			{
				vector.push(Math.floor(direction / Math.pow(3, axis)) % 3);
			}
			if (vector[vectorAxis] === vectorSign)
			{
				directions.push(direction);
			}
		}
		return directions;
	}
	
	static GetCoordinates(value, matrix, dimensions)
	{
		if (dimensions === 1)
		{
			if (matrix.includes(value))
			{
				return [matrix.indexOf(value)];
			}
			return undefined;
		}
		for (let i = 0; i < matrix.length; i++)
		{
			const coords = MatrixUtilities.GetCoordinates(value, matrix[i], dimensions - 1);
			if (coords !== undefined)
			{
				coords.unshift(i);
				return coords;
			}
		}
		return undefined;
	}
	
	static InsertHyperplaneInMatrix(axis, sign, matrix, dimensions)
	{
		if (dimensions === 1)
		{
			if (sign < 0)
			{
				matrix.splice(0, 0, null);
			}
			if (sign > 0)
			{
				matrix.splice(matrix.length, 0, null);
			}
			return;
		}
		if (dimensions === (axis + 1))
		{
			/* Do the insertion */
			let root = undefined;
			if (sign < 0)
			{
				matrix.splice(0, 0, []);
				root = matrix[0];
			}
			if (sign > 0)
			{
				matrix.splice(matrix.length, 0, []);
				root = matrix[-1];
			}

			/* Assemble list of dimension lengths */
			const dimensionalLengths = [];
			let currentDimension = root;
			while (Array.isArray(currentDimension))
			{
				dimensionalLengths.push(currentDimension.length);
				currentDimension = currentDimension[0];
			}

			/* Fill in any gaps */
			MatrixUtilities.FillHyperPlaneInMatrix(root, dimensionalLengths);

			return;
		}
		for (let i = 0; i < matrix.length; i++)
		{
			MatrixUtilities.InsertHyperplaneInMatrix(axis, sign, matrix[i], dimensions - 1);
		}
	}
	
	static FillHyperPlaneInMatrix(root, dimensionalLengths)
	{
		if (dimensionalLengths.length === 1)
		{
			for (let i = 0; i < dimensionalLengths[0]; i++)
			{
				root.push(null);
			}
			return;
		}
		for (let i = 0; i < dimensionalLengths[0]; i++)
		{
			root.push([]);
			MatrixUtilities.FillHyperPlaneInMatrix(root[i], dimensionalLengths.slice(1, dimensionalLengths.length));
		}
	}
	
	static MatrixToString(matrix, dimensions)
	{
		if (dimensions === 1)
		{
			return "[" + matrix.toString() + "]";
		}
		
		let output = "[";
		for (let i = 0; i < matrix.length; i++)
		{
			output += MatrixUtilities.MatrixToString(matrix[i], dimensions - 1) + ",";
		}
		output = output.slice(0, -1) + "]";
		return output;
	}
}

class ArrayUtilities
{
	static ProductOfLastN(array, n)
	{
		const cutoff = Math.max(Math.min(array.length - n, array.length), 0);
		return array.reduceRight(
			(totalProduct, currentValue, currentIndex) => {
				if (currentIndex < cutoff) return totalProduct;
				return totalProduct * currentValue;
			},
			1
		);
	}
}