const formatLineItems = (productsList,productsToCheckout)=>{
    // Map each product in the productList to the line_items format required by Stripe
    const lineItems = productsList.map((prod) => {
        const { quantity } = productsToCheckout.find(
          (item) => prod.reference === item.reference
        );
        
        
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: prod.name,
              images: [prod.images[0]],
            },
            unit_amount: prod.price * 100,  // Stripe requires the price to be in the smallest currency unit (i.e., cents)
          },
          quantity,
        };
      });

    return lineItems
      
}
const checkStockAndFormatOrder =(productsList,productsToCheckout)=>{
    let outOfStockProducts = [];
    let productsForOrder = []

    productsList.forEach(prod=>{
        const { quantity } = productsToCheckout.find(
            (item) => prod.reference === item.reference
          );
        if(prod.stock<quantity){
            outOfStockProducts.push({name:prod.name,stock:prod.stock})
        }else{
            productsForOrder.push({
              product:prod._id,
              quantity,
              priceAtPurchase: prod.price-(prod.price*prod.discount/100) 
            })
        }
        
    })

    if(outOfStockProducts.length > 0){
        throw new Error(
            `The following products do not have enough stock: ${outOfStockProducts
              .map((p) => `${p.name} (only ${p.stock} left)`)
              .join(", ")}`
          );
    }
    
    return productsForOrder
}

module.exports ={formatLineItems,checkStockAndFormatOrder}