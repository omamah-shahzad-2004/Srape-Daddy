const clientPromise = require('./mongodb.js');

//Function to connect to MongoDB and store scrapped data in it
async function storeInDB(scrapped_data) {
    const client = await clientPromise;

    try{
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const db = client.db("scrappedInfo");
        const collection = db.collection("webInfo");

        const res = await collection.insertOne(scrapped_data);
        console.log(`New document inserted with _id: ${res.insertedId}`);
    } catch(error) {
        console.error("Error connecting to MongoDB Atlas:", error)
    } finally {
        await client.close();
    }
}

