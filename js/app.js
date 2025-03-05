const questionCard = document.getElementById('questionCard');
const questionTextFront = document.getElementById('questionText');
const categoryTextFront = document.getElementById('categoryText');
const questionTextBack = document.getElementById('questionTextBack');
const categoryTextBack = document.getElementById('categoryTextBack');
const flipSound = document.getElementById('flipSound');
const viewAllBtn = document.getElementById('viewAllBtn');
const viewAllContainer = document.getElementById('viewAllContainer');
const questionsList = document.getElementById('questionsList');

let usedIndexes = [];
let currentIndex = null;
let questionsData = {};

// Fetch the question data from the .json file
fetch('./Assets/questions.json')
    .then(response => response.json())
    .then(data => {
        questionsData = data;
    })
    .catch(error => {
        console.error('Error fetching questions:', error);
    });

// Fetch a random question from the dataset
function getRandomQuestion() {
    // Get all categories
    const categories = Object.keys(questionsData);
    
    // Select a random category
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Get the questions for the selected category
    const questionsInCategory = questionsData[randomCategory];
    
    // Select a random question from the category
    const randomQuestion = questionsInCategory[Math.floor(Math.random() * questionsInCategory.length)];
    
    return {
        question: randomQuestion,
        category: randomCategory
    };
}

// HEADER BAR

// Toggle dropdown visibility
function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
window.addEventListener('click', (event) => {
    const dropdown = document.querySelector('.dropdown');
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Update the card content
function updateCardContent(questionInfo) {
    questionTextFront.textContent = questionInfo.question;
    categoryTextFront.textContent = questionInfo.category;
    questionTextBack.textContent = questionInfo.question;
    categoryTextBack.textContent = questionInfo.category;
}

// Handle card flip
questionCard.addEventListener('click', () => {
    flipSound.currentTime = 0; // Reset sound to start
    flipSound.play();

    // Toggle the 'flipped' class to flip the card
    questionCard.classList.toggle('flipped');

    // Ensure new data is updated halfway through the flip animation
    const questionInfo = getRandomQuestion();
    const flipDuration = 400; // Same as the transition time in the CSS

    // Set a timeout to update content after half of the flip duration (200ms)
    setTimeout(() => {
        updateCardContent(questionInfo);
    }, flipDuration / 2);

    // Update card content after the flip animation
    questionCard.addEventListener('transitionend', function onTransitionEnd() {
        // Remove the event listener after it fires once
        questionCard.removeEventListener('transitionend', onTransitionEnd);
    });
});

// View All button functionality
viewAllBtn.addEventListener('click', () => {
    // Show the View All container and hide the card container
    document.body.classList.add('view-all-active');
    viewAllContainer.style.display = 'flex'; // Make sure it is shown
    questionsList.innerHTML = ''; // Clear existing content

    // Populate the list with all questions and categories
    for (const category in questionsData) {
        const categoryHeader = document.createElement('h2');
        categoryHeader.classList.add('category-header');
        categoryHeader.textContent = category;
        questionsList.appendChild(categoryHeader);

        questionsData[category].forEach(question => {
            const questionItem = document.createElement('div');
            questionItem.classList.add('question-item');
            
            const questionText = document.createElement('div');
            questionText.classList.add('question-text');
            questionText.textContent = question;
            
            const categoryText = document.createElement('div');
            categoryText.classList.add('category-text');
            categoryText.textContent = `Category: ${category}`;
            
            questionItem.appendChild(questionText);
            questionItem.appendChild(categoryText);
            
            questionsList.appendChild(questionItem);
        });
    }
});

// To close the "View All" container when clicked outside
viewAllContainer.addEventListener('click', (event) => {
    if (event.target === viewAllContainer) {
        document.body.classList.remove('view-all-active');
        viewAllContainer.style.display = 'none';
    }
});