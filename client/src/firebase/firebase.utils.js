import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyDk3nlo7-F9VlULRI7q8sfsOxgP-_9jJE4",
    authDomain: "shop-b6505.firebaseapp.com",
    databaseURL: "https://shop-b6505.firebaseio.com",
    projectId: "shop-b6505",
    storageBucket: "",
    messagingSenderId: "69539150471",
    appId: "1:69539150471:web:97d2ccfc0b68b917f49622"
  };

  export const createUserProfileDocument = async (userAuth, additionalData) => {
    if(!userAuth) return;

     const userRef = firestore.doc(`users/${userAuth.uid}`);
    
     const snapShot = await userRef.get();

    //  console.log(snapShot);

    if(!snapShot.exists) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();

      try {
        await userRef.set({
          displayName,
          email,
          createdAt,
          ...additionalData
        })
      } catch (error) {
        console.log('Error Creating User', error.message);
      }
    }
      return userRef;
  };

  export const addCollectionsAndDocuments = async (collectionKey, objectsToAdd) => { //Funcion para agregar colleciones a firebase, no la usamos mas. 157
    const collectionRef = firestore.collection(collectionKey);
    // console.log(collectionRef);

    const batch = firestore.batch(); //Recopilamos toda la consulta, una vez lista la ejecutamos

    objectsToAdd.forEach(obj => {
      const newDocRef = collectionRef.doc();
      // console.log(newDocRef);
      batch.set(newDocRef, obj); //Ingresamos el documento y la collecion a firebase
    });

    return await batch.commit();
  }; //Para agregar los objetos a firebase.

  export const covertCollectionSnapShotToMap = (collections) => {
    const transformedCollection = collections.docs.map(doc => {
      const { title, items } = doc.data();

      return {
        routeName: encodeURI(title.toLowerCase()),
        id: doc.id,
        title,
        items
      }
    });
    // console.log(transformedCollection);
    return transformedCollection.reduce((acumulator, collection) => {
      acumulator[collection.title.toLowerCase()] = collection;
      return acumulator;
    } , {});
  };

  firebase.initializeApp(config);

  export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe();
            resolve(userAuth);
        }, reject);
    });
  };

  export const auth = firebase.auth();
  export const firestore = firebase.firestore();

  export const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account'});
  export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

  export default firebase;