//data/dummyData.js
export const categories = ['electronics', 'fashion', 'groceries', 'home', 'beauty'];

export const dummyProducts = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100000) + 5000,
    description: `Premium quality product ${i + 1} description`,
  image: `https://source.unsplash.com/random/800x600?product,${i}`,
  category: categories[i % categories.length],
  rating: Math.floor(Math.random() * 5) + 1,
  reviews: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
    id: j + 1,
    user: `User ${j + 1}`,
    comment: `Great product! ${['❤️', '👍', '🔥', '🎉', '💯'][j % 5]}`
  }))
}));

// data/products.js

// export const categories = ['electronics', 'fashion', 'groceries', 'home', 'beauty'];

// /**
//  * Fetch products from the API endpoint and transform them
//  * to include any additional properties needed by your app.
//  */
// export const dummyProducts = async () => {
//   try {
//     const response = await fetch('http://127.0.0.1:5000/api/products');
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const apiProducts = await response.json();

//     // Transform the API data to match the expected structure.
//     // You can add any default values if the API doesn't provide them.
//     const transformedProducts = apiProducts.map(item => ({
//       id: item.id,
//       name: item.name,
//       price: item.price,
//       description: item.description || `Premium quality product ${item.id} description`,
//       // Use the provided image_url from the API; otherwise fall back to a placeholder.
//       image: item.image_url || `https://source.unsplash.com/random/800x600?product,${item.id}`,
//       // Convert category to lowercase and fall back to a default category if necessary.
//       category: item.category ? item.category.toLowerCase() : categories[item.id % categories.length],
//       // Provide static/default values for ratings and reviews if not available.
//       rating: item.rating || Math.floor(Math.random() * 5) + 1,
//       reviews: item.reviews || Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
//         id: j + 1,
//         user: `User ${j + 1}`,
//         comment: `Great product! ${['❤️', '👍', '🔥', '🎉', '💯'][j % 5]}`
//       })),
//       // Include any additional properties from the API, such as stock.
//       stock: item.stock
//     }));

//     return transformedProducts;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return [];
//   }
// };
