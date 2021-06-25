const widgetMessagesList = ["info", "exclamation", "success"]; //list of closing elements

class ItemToHide {
    constructor(id) {
        this.clickTarget = document.getElementById(id);
    }

    showMe(text) { // shows hidden message + adds custom text to it
        this.clickTarget.parentElement.classList.remove('hidden');
        this.clickTarget.parentElement.querySelector('.app__widget--message--text').innerHTML = text;

    }

    addListener() { //after click parent of element is hidden
        this.clickTarget.addEventListener('click', (e) => e.target.parentElement.classList.add('hidden'));
    }
}

//construct elements to hide, then add listener
const widgetMessages = widgetMessagesList.map(el => new ItemToHide(el));
widgetMessages.forEach(el => el.addListener());

//Tworzenie przepisu
const form = {
    form: document.getElementById('recipe-form'),
    cancel: document.getElementById('cancel-recipe'),
    save: document.getElementById('save-recipe'),
    name: document.getElementById('recipe-name'),
    description: document.getElementById('recipe-description'),
    instruction: document.getElementById('recipe-instruction'),
    addInstruction: document.getElementById('recipe-instruction-add'),
    instructionsList: document.getElementById('instructions-list'),
    ingredient: document.getElementById('recipe-ingredients'),
    addIngredient: document.getElementById('recipe-ingredients-add'),
    ingredientsList: document.getElementById('ingredients-list'),
}
//Dodanie składnika lub instrukcji
let editedElem = null;
const addToListFinish = (edit, remove, input, placeholder) => {
    editListElement(edit, input);
    deleteListElement(remove);
    document.getElementById(input).value = '';
    document.getElementById(input).setAttribute('placeholder', placeholder);
    editedElem = null;
}

const addToList = (e) => {
    if (e.target === form.addInstruction) {
        if (form.instruction.value.length > 50 || form.instruction.value.length < 5) {
            showWarning('recipe-instruction-warning');
        } else if (editedElem) {
            editedElem.innerHTML = form.instruction.value + ' <i class="edit-list-item fas fa-edit"></i> <i class="remove-list-item fas fa-trash-alt"></i>';
            addToListFinish('#instructions-list .edit-list-item', '#instructions-list .remove-list-item', 'recipe-instruction', 'Jaki jest następny krok?');
        } else {
            const listElement = document.createElement('li');
            listElement.innerHTML = form.instruction.value + ' <i class="edit-list-item fas fa-edit"></i> <i class="remove-list-item fas fa-trash-alt"></i>';
            form.instructionsList.appendChild(listElement);
            addToListFinish('#instructions-list .edit-list-item', '#instructions-list .remove-list-item', 'recipe-instruction', 'Jaki jest następny krok?');
        }
    } else if (e.target === form.addIngredient) {
        if (form.ingredient.value.length > 150 || form.ingredient.value.length < 5) {
            showWarning('recipe-ingredient-warning');
        } else if (editedElem) {
            editedElem.innerHTML = form.ingredient.value + ' <i class="edit-list-item fas fa-edit"></i> <i class="remove-list-item fas fa-trash-alt"></i>';
            addToListFinish('#ingredients-list .edit-list-item', '#ingredients-list .remove-list-item', 'recipe-ingredients', 'Jaki jest następny składnik?');
        } else {
            const listElement = document.createElement('li');
            listElement.innerHTML = form.ingredient.value + ' <i class="edit-list-item fas fa-edit"></i> <i class="remove-list-item fas fa-trash-alt"></i>';
            form.ingredientsList.appendChild(listElement);
            addToListFinish('#ingredients-list .edit-list-item', '#ingredients-list .remove-list-item', 'recipe-ingredients', 'Jaki jest następny składnik?');
        }
    } else {
        console.log('something went wrong');
    }
}
//Usuwanie ostrzeżeń dotyczących długości danych wprowadzonych w formularzu
document.querySelectorAll('.warning').forEach(el => el.addEventListener('click', e => e.target.classList.add('hidden')));
//Ukrywanie formularza
const hideRecipeForm = () => form.form.classList.add('hidden');
//Dodawanie elementów do list
form.addInstruction.addEventListener('click', addToList);
form.addIngredient.addEventListener('click', addToList);
//Anulowanie wypełniania formularza
form.cancel.addEventListener('click', () => {
    form.form.reset;
    hideRecipeForm();
});
//Zapisanie przepisu
const showWarning = (id) => {
    document.getElementById(id).classList.remove('hidden');
}
const save = (e) => {
    e.preventDefault();
    if (form.name.value.length > 50 || form.name.value.length < 2) {
        showWarning('recipe-name-warning');
    }
    if (form.description.value.length > 360 || form.description.value.length < 10) {
        showWarning('recipe-description-warning');
    } else {
        let recipes = JSON.parse(localStorage.getItem('localRecipes'));
        if (!recipes) {
            recipes = [];
        }
        const instructions = document.querySelectorAll('#instructions-list li');
        const inst = [];
        instructions.forEach(el => inst.push(el.innerText.slice(0, -2)));
        const ingredients = document.querySelectorAll('#ingredients-list li');
        const ingr = [];
        ingredients.forEach(el => ingr.push(el.innerText.slice(0, -2)));
        const recipe = {
            name: form.name.value,
            description: form.description.value,
            instructions: inst,
            ingredients: ingr
        }
        recipes.push(recipe);
        localStorage.setItem('localRecipes', JSON.stringify(recipes));
        hideRecipeForm();
        counterUpdate();
    }
}
//Uaktualnienie licznika przepisów
const counterUpdate = () => {
    const l = JSON.parse(localStorage.getItem('localRecipes'));
    document.getElementById('recipes-lenght').innerText = l.length;
}
form.save.addEventListener('click', save);

window.addEventListener('DOMContentLoaded', () => counterUpdate());

document.getElementById('widget-add-recipe').addEventListener('click', () => form.form.classList.remove('hidden'));


//Dodanie imienia dla odwiedzającego po raz pierwszy
const firstTime = localStorage.getItem("userName");
const nameForm = document.querySelector(".app__form");
const getName = document.querySelector(".userName")
const formBtn = document.querySelector(".form__button");

if (!firstTime) {
    formBtn.addEventListener('click', function () {
        const userName = getName.value;
        localStorage.setItem('userName', `${userName}`);
        document.getElementById('user__name').innerHTML = `${localStorage.getItem("userName")}`;
    })

} else {
    nameForm.classList.add("hidden");
    document.getElementById("user__name").innerHTML = `${localStorage.getItem("userName")}`;
}

//Usuwanie elementów listy
const deleteListElement = (selector) => {
    document.querySelectorAll(selector).forEach(el => el.addEventListener('click', e => e.target.parentElement.remove()));
}


//Edytowanie elementów listy
const editListElement = (selector, input) => {
    document.querySelectorAll(selector).forEach((element) => {
        element.addEventListener("click", (e) => {
            editedElem = e.target.parentElement;
            document.getElementById(input).value =
                e.target.parentElement.innerText.slice(0, -2);
        });
    });
}

//Wyświetla numer aktualnego tygodnia
const weekNumber = document.getElementById("weekNumber");
const next = document.querySelector(".button__next");
const previous = document.querySelector(".button__previous");

next.style.cursor = 'pointer';
previous.style.cursor = 'pointer';

Date.prototype.getWeekNumber = function(){
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};


weekNumber.innerHTML = `${new Date().getWeekNumber()}`;
