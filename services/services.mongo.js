

const MongoClient = require('mongodb').MongoClient;

class MongoService {

    static dbName = "volunteers";
    static uri = "mongodb+srv://administrator:wvxNVYswOPWLt7mR@cluster0.4rwmr.azure.mongodb.net/<dbname>?retryWrites=true&w=majority";
    
    client;
    db;
    async init() {
        this.client = await MongoClient.connect(MongoService.uri, { useNewUrlParser: true,  useUnifiedTopology: true });
        this.db = await this.client.db(MongoService.dbName);
    }
    async destroy() {
        if (this.client) {
            this.client.close();
        }
    }
}

module.exports = MongoService;