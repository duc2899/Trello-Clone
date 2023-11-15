import { Client, Account, ID, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6530c11726742fe501f0");

const account = new Account(client);

const database = new Databases(client);

const storage = new Storage(client);

export { client, account, database, storage, ID };
