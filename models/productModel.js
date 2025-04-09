const fs = require("fs").promises;
const path = require("path");

const dataFile = path.join(__dirname, "../data/products.json");

// Get all products
async function getAllProducts() {
	try {
		// read in the products.json file
		const data = await fs.readFile(dataFile, "utf8");
		// parse the products from the JSON and return as an array
		return JSON.parse(data).products;
	} catch (err) {
		if (err.code === "EN0ENT") {
			// If file doesn't exist, return empty array
			return [];
		}
		throw err;
	}
}

// Get a single product by ID
async function getProductById(id) {
	const products = await getAllProducts();
	return products.find((product) => product.id === parseInt(id));
}

// Create a new product
async function createProduct(product) {
	const products = await getAllProducts();

	// Generate new ID (max ID + 1)
	const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
	// create a new product by inserting the generated id and appending the product data passed in
	const newProduct = { id: newId, ...product };

	// add the new product to the existing list of products
	products.push(newProduct);

	// convert updated products array back to JSON and write it to the JSON file
	await fs.writeFile(dataFile, JSON.stringify({ products }, null, 2));

	return newProduct;
}

// Update an existing product
async function updateProduct(id, updatedProduct) {
	const products = await getAllProducts();
	// find the index of the product based on the passed in id
	const index = products.findIndex((product) => product.id === parseInt(id));

	// If the product isn't found, return null
	if (index === -1) return null;

	// use the index to retrieve the existing product information, and replace each field with updated data
	products[index] = { ...products[index], ...updatedProduct };

	// convert updated products array back to JSON and write it to the JSON file
	await fs.writeFile(dataFile, JSON.stringify({ products }, null, 2));

	return products[index];
}

// Delete a product
async function deleteProduct(id) {
	const products = await getAllProducts();
	// find the index of the product based on the passed in id
	const index = products.findIndex((product) => product.id === parseInt(id));

	// If the product isn't found, return false to signify that the delete operation could not be performed
	if (index === -1) return false;

	// remove the product at the given index
	products.splice(index, 1);

	// convert updated products array back to JSON and write it to the JSON file
	await fs.writeFile(dataFile, JSON.stringify({ products }, null, 2));

	// return true to signify that the delete operation was successfully performed
	return true;
}

// export the functions so they can be used to simulate database interactions for the router in products.js
module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
