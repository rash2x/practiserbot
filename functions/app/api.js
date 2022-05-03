const { db } = require('./firebase');
const categoriesRef = db.collection('categories');
const lessonsRef = db.collection('lessons');

const getLessonsByCategoryId = async (categoryId) => {
  const lessons = [];
  const categoryRef = db.collection('categories').doc(categoryId);
  const categorySnapshot = await categoryRef.get();
  const lessonsSnapshot = await lessonsRef.get();

  if(categorySnapshot.exists) {
    const data = categorySnapshot.data();

    lessonsSnapshot.forEach(doc => {
      if(data.lessons.includes(doc.id)) {
        lessons.push({
          id: doc.id,
          ...doc.data()
        })
      }
    });

    return lessons;
  }
};

const getCategories = async (parent) => {
  const categories = [];
  const categoriesSnapshot = await categoriesRef.get();

  categoriesSnapshot.forEach(doc => {
    if(parent && doc.data().parent === parent) {
      categories.push({
        id: doc.id,
        ...doc.data()
      })
    }

    if(!parent && !doc.data().hasOwnProperty('parent')) {
      categories.push({
        id: doc.id,
        ...doc.data()
      })
    }
  });

  return categories;
}

const getLessonById = async (lessonId) => {
  const lessonRef = db.collection('lessons').doc(lessonId);
  const lessonSnapshot = await lessonRef.get();

  if(lessonSnapshot.exists) {
    return lessonSnapshot.data();
  }
};

const getCategoryById = async (categoryId) => {
  const categoryRef = db.collection('categories').doc(categoryId);
  const categorySnapshot = await categoryRef.get();

  if(categorySnapshot.exists) {
    return categorySnapshot.data();
  }
};

module.exports.api = {
  getLessonsByCategoryId,
  getCategories,
  getLessonById,
  getCategoryById
};
