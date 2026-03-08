const { createClient } = supabase

const supabaseUrl = "https://gljlxmdsulypkvzxstzh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsamx4bWRzdWx5cGt2enhzdHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTQwMjAsImV4cCI6MjA4ODM5MDAyMH0.a2tk1uOsIIsuh_zLWsqeYV1F8HY0k-6q5BlXEev0a6M";

const db = createClient(supabaseUrl, supabaseKey, {

})

async function loadCategories() {
    console.log("LOAD CATEGORIS")
    const { data, error } = await db
        .from("categories")
        .select("*")


    const select = document.getElementById("categorySelect")

    select.innerHTML = ""

    data.forEach(cat => {

        const option = document.createElement("option")

        option.value = cat.id
        option.textContent = cat.name

        select.appendChild(option)

    })

}

async function addCategory() {

    const name = document.getElementById("categoryName").value
    console.log(db)
    const { error } = await db
        .from("categories")
        .insert([{ name }])

    if (error) {
        alert("Error adding category")
        console.log(error)
    } else {
        alert("Category Added")
        loadCategories()
    }

}

async function addProduct() {

    const name = document.getElementById("productName").value
    const price = document.getElementById("price").value
    const category = document.getElementById("categorySelect").value
    const file = document.getElementById("productImage").files[0]

    let imageUrl = ""

    if (file) {

        const fileName = Date.now() + "_" + file.name

        // upload image
        const { data: uploadData, error: uploadError } = await db.storage
            .from("product-images")
            .upload(fileName, file, { upsert: true })

        if (uploadError) {
            console.log("Upload error:", uploadError)
            alert("Image upload failed")
            return
        }

        // get public url
        const { data } = db.storage
            .from("product-images")
            .getPublicUrl(fileName)

        imageUrl = data.publicUrl

        console.log("Image URL:", imageUrl)
    }

    // insert product
    const { error } = await db
        .from("products")
        .insert([
            {
                name: name,
                price: price,
                category_id: category,
                image_url: imageUrl
            }
        ])

    if (error) {
        console.log("Insert error:", error)
        alert("Product insert failed")
        return
    }

    alert("Product Added")

    loadProducts()
}
async function loadProducts(){

const { data, error } = await db
.from("products")
.select("name,price,image_url,categories(name)")


const list = document.getElementById("productList")

list.innerHTML=""

data.forEach(product=>{
console.log("img url", product.image_url)
const div=document.createElement("div")

div.className="product"

div.innerHTML=`
<img src="${product.image_url}" width="120" height="120" style="object-fit:cover;border-radius:8px;">
<br>
<strong>${product.name}</strong>
<br>
₹${product.price}
<br>
<small>${product.categories.name}</small>
`

list.appendChild(div)

})

}

loadCategories()
loadProducts()
