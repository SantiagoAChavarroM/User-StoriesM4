# StreamHub — MongoDB Implementation (User Story Week 3)

Santiago Alejandro Chavarro Murillo  
Clan: Thompson  
santiagoachm@gmail.com  
ID: 1152443924  

This project corresponds to **User Story Week 3 of Module 4 at Riwi**.

The main objective was to model and implement a semistructured database in **MongoDB** for a streaming-like domain, applying document design, CRUD operations, indexes, and aggregation pipelines to produce useful reports and metrics.

---

## Objective

Develop a functional NoSQL database system to manage:

- Users  
- Audiovisual content (movies and series)  
- Reviews / ratings  

The system ensures:

- Clean document modeling for a streaming domain  
- Full CRUD coverage (insert, read, update, delete)  
- Operator-based querying for common filters  
- Index creation for query performance  
- Aggregation pipelines for reporting and analytics  

---

## Technologies Used

- MongoDB 7.x  
- mongosh 2.x  
- MongoDB Compass (optional)  
- Visual Studio Code  

---

## Project Structure

streamhub_commands.js  

The script includes:

- Database selection and initial verification  
- Domain design decision (Model B: separate `reviews` collection)  
- Data seeding using `insertMany()`  
- Queries using operators: `$gt`, `$lt`, `$eq`, `$in`, `$and`, `$or`, `$regex`  
- Updates with `updateOne()` and `updateMany()`  
- Deletions with `deleteOne()` and `deleteMany()`  
- Index creation and validation (`createIndex()`, `getIndexes()`)  
- Aggregation pipelines with `$match`, `$group`, `$sort`, `$project`, `$unwind`  
  - Plus `$lookup` to relate reviews with content  

---

## Data Model (Summary)

**Collections**

- `users`  
  - Basic user profile + plan + simple watch metric

- `contents`  
  - Movies and series in a single collection  
  - Series include a simple `seasons` array

- `reviews`  
  - Stored separately (references `contents._id` via `contentId`)  
  - Includes `rating`, `comment`, and `isSpam` for moderation flows  

---

## Learnings

This project reinforced:

- Document modeling choices (embedding vs referencing)  
- CRUD operations in MongoDB using mongosh  
- Building reliable filters using comparison, logical, and regex operators  
- Why and how to create indexes based on query patterns  
- Aggregation pipelines for metrics (grouping, sorting, reshaping output)  
- Using `$unwind` for array-based analytics (e.g., genres)  
- Using `$lookup` to enrich analytics across collections  

---

## Final Result

A complete StreamHub database implemented entirely in MongoDB, demonstrating:

- A clean and minimal NoSQL schema for a streaming platform  
- Correct CRUD operations and operator-based queries  
- Justified indexes validated with `getIndexes()`  
- Two robust aggregation reports producing clear metrics for analysis  