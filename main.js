const htmlBtn = document.getElementById("htmlBtn");
const cssBtn = document.getElementById("cssBtn");
const jsBtn = document.getElementById("jsBtn");
const accessibilityBtn = document.getElementById("accessibilityBtn");
const subjectIcon = document.querySelectorAll("img[alt='subject-icon']");
const subjectText = document.querySelectorAll(".subject-text");
const subjectTitleCon = document.querySelectorAll(".subject-title-container");
const imgCon = document.querySelectorAll(".header-img-container");
const questionText = document.querySelector(".question");
const menuCon = document.querySelector(".menu-container");
const questionCon = document.querySelector(".questions-container");
const optionContainer = document.querySelectorAll(".option");
const optionListText = document.querySelectorAll(".option-list");
const optionAnswerCon = document.querySelectorAll(".option-container");
const noOfQuestions = document.getElementById("noQuestionAnswered");
const correctImg = document.querySelectorAll("img[alt='icon-correct']");
const submitBtn = document.getElementById("submitBtn");
const errorText = document.querySelector(".error-container");
const resultContainer = document.querySelector(
	".completed-main-quiz-container"
);
const scoreResult = document.querySelector(".actual-score");
const playAgainBtn = document.getElementById("playAgainBtn");
const darkMode = document.querySelectorAll(
	"img[alt='icon-sun-dark'], img[alt='icon-moon-dark']"
);
const lightMode = document.querySelectorAll(
	"img[alt='icon-sun-light'], img[alt='icon-moon-light']"
);
const toggleSwitch = document.querySelector(".toggle-switch");

// DARK-MODE
toggleSwitch.addEventListener("click", () => {
	toggleSwitch.classList.toggle("dark-mode-click");
	document.body.classList.toggle("dark-mode");

	darkMode.forEach((ic) => ic.classList.toggle("hidden"));
	lightMode.forEach((ic) => ic.classList.toggle("hidden"));
});

let quizData = null;
let currentIndex = 0;
let selectedAnswer = null;
let currentSubject = null;
let hasSubmitted = false;
let score = 0;

const loadQuizzess = async () => {
	const response = await fetch("./data.json");
	const dataObj = await response.json();
	quizData = dataObj.quizzes;
	htmlBtn.onclick = () => {
		currentIndex = 0;
		currentSubject = quizData[0];
		subject(currentSubject);
	};
	cssBtn.onclick = () => {
		currentIndex = 0;
		currentSubject = quizData[1];
		subject(currentSubject);
	};
	jsBtn.onclick = () => {
		currentIndex = 0;
		currentSubject = quizData[2];
		subject(currentSubject);
	};
	accessibilityBtn.onclick = () => {
		currentIndex = 0;
		currentSubject = quizData[3];
		subject(currentSubject);
	};
};

// Questions and header-images
const headerText = (subject) => {
	subjectText.forEach((text) => {
		text.textContent =
			subject.title.charAt(0).toUpperCase() +
			subject.title.slice(1).toLowerCase();
	});
};
const headerImg = (subject) => {
	subjectIcon.forEach((ic) => {
		ic.src = subject.icon;
		ic.alt = `${subject.title} icon`;
	});
};
const headerDisplay = (display) => {
	headerText(display);
	subjectTitleCon.forEach((container) => {
		container.style.visibility = "visible";
	});
	headerImg(display);
	imgCon.forEach((con) => {
		con.style.backgroundColor = display.color;
	});
};
const subject = (inputSubject) => {
	addHidden(menuCon);
	removeHidden(questionCon);
	score = 0;
	scoreResult.textContent = score;
	headerDisplay(inputSubject);
	prepareQuiz(inputSubject);
	displayQuestion(inputSubject);
};

// Remove Hidden
const removeHidden = (remove) => {
	remove.classList.remove("hidden");
	remove.classList.remove("hide");
};
// Add Hidden
const addHidden = (add) => {
	add.classList.add("hide");
};
const removeHide = (remove) => {
	remove.classList.remove("hide");
};

// Utility function to shuffle any array
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};
// Shuffle Questions
const prepareQuiz = (subject) => {
	subject.questions = shuffleArray(subject.questions);

	subject.questions.forEach((q) => {
		q.options = shuffleArray([...q.options]);
	});
};

// Display Questions
const displayQuestion = (subject) => {
	const question = subject.questions[currentIndex].question;
	const options = subject.questions[currentIndex].options;
	const progessBar = document.querySelector(".progressing-bar");
	const questions = subject.questions;

	questionText.textContent = question;
	noOfQuestions.textContent = currentIndex + 1;
	progessBar.style.width = `${
		((currentIndex + 1) / questions.length) * 100
	}%`;
	optionListText.forEach((optionElement, index) => {
		optionElement.textContent = options[index];
	});
};

// updateUI
const resetUI = () => {
	optionContainer.forEach((con) => {
		con.classList.remove("clicked");
	});
};
const resetAnsConUI = () => {
	optionAnswerCon.forEach((con) => {
		con.classList.remove("option-color");
	});
};
const resetImgConUI = () => {
	correctImg.forEach((con) => {
		con.classList.add("hidden");
	});
};
const ansCon = (con) => {
	resetAnsConUI();
	con.classList.add("option-color");
};

const resetAllStates = () => {
	optionContainer.forEach((con) => {
		con.classList.remove("clicked", "error", "dimmed", "correct");
	});

	optionAnswerCon.forEach((con) => {
		con.classList.remove("option-color", "option-correct", "option-error");
	});

	correctImg.forEach((img) => {
		img.classList.add("hidden");
	});

	const errorImgs = document.querySelectorAll("img[alt='icon-error']");
	errorImgs.forEach((img) => img.classList.add("hidden"));
};

// EVENT-LISTNER
optionContainer.forEach((con, index) => {
	con.addEventListener("click", () => {
		if (hasSubmitted) return;
		resetUI();
		con.classList.add("clicked");
		ansCon(optionAnswerCon[index]);
		selectedAnswer = optionListText[index].textContent;
		errorText.style.display = "none";
	});
});
// SUBMIT
submitBtn.addEventListener("click", () => {
	if (!currentSubject) return;

	if (!hasSubmitted) {
		if (selectedAnswer === null) {
			errorText.style.display = "flex";
			return;
		}

		hasSubmitted = true;
		const correct = currentSubject.questions[currentIndex].answer;

		resetImgConUI();

		optionContainer.forEach((con, index) => {
			const optionText = optionListText[index].textContent;

			if (optionText === correct) {
				correctImg[index].classList.remove("hidden");
				optionAnswerCon[index].classList.add("option-correct");
				con.classList.add("correct");
				if (optionText === selectedAnswer) {
					score++;
				}
			}
			if (optionText === selectedAnswer && optionText !== correct) {
				const errorImg = con.querySelector("img[alt='icon-error']");
				if (errorImg) errorImg.classList.remove("hidden");
				optionAnswerCon[index].classList.add("option-error");
				con.classList.add("error");
			}
		});

		submitBtn.textContent = "Next Question";
	} else {
		currentIndex++;
		if (currentIndex >= currentSubject.questions.length) {
			removeHidden(resultContainer);
			addHidden(questionCon);
		}

		hasSubmitted = false;
		selectedAnswer = null;

		resetAllStates();

		displayQuestion(currentSubject);

		submitBtn.textContent = "Submit Answer";
	}
	scoreResult.textContent = score;
});

playAgainBtn.addEventListener("click", () => {
	addHidden(resultContainer);
	removeHide(menuCon);
	selectedAnswer = null;
	currentIndex = 0;
	currentSubject = null;
	score = 0;
	scoreResult.textContent = score;
	subjectTitleCon.forEach((container) => {
		container.style.visibility = "hidden";
	});
});

loadQuizzess();
