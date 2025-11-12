import db from './db.js'


export const getPosts = async () => {
    try {
        let entries 
        let entriesData
            entries = await db.collection('posts').orderBy("created", "desc").get();
            entriesData = entries.docs.map(entry => ({
                id: entry.id,
                ...entry.data()
              }));


        return JSON.parse(JSON.stringify(entriesData))
      } catch (e) {
        return JSON.parse({ e });
      }
};

export async function getPostPaths() {

    try {
        let entries 
        let entriesData
            entries = await db.collection('posts').get();
            entriesData = entries.docs.map(entry => (
                { params: { id: entry.id } }

            ));

        return JSON.parse(JSON.stringify(entriesData))
      } catch (e) {

        return JSON.parse({ e });
      }




}

export const getPostById = async (id) => {
    try {
        const doc = await db.collection('posts').doc(id).get();

        const postData = {
            id: doc.id,
            he: "asf",
            ...doc.data()
        }
          return JSON.parse(JSON.stringify(postData));
        

      } catch (e) {

        return JSON.parse({ e });
      }
};
