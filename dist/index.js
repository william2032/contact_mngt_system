"use strict";
class Contact {
    constructor(id, firstName, lastName, email, phoneNumber) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }
}
class ContactManager {
    constructor() {
        this.contacts = [];
        this.loadFromStorage();
    }
    addContact(contact) {
        this.contacts.push(contact);
        this.saveToStorage();
    }
    updateContact(updated) {
        const index = this.contacts.findIndex(contact => contact.id === updated.id);
        if (index > -1) {
            this.contacts[index] = updated;
            this.saveToStorage();
        }
    }
    deleteContact(id) {
        this.contacts = this.contacts.filter(c => c.id !== id);
        this.saveToStorage();
    }
    getContacts() {
        return this.contacts;
    }
    saveToStorage() {
        localStorage.setItem("contacts", JSON.stringify(this.contacts));
    }
    loadFromStorage() {
        const data = localStorage.getItem("contacts");
        if (data) {
            this.contacts = JSON.parse(data);
        }
    }
}
const form = document.getElementById('contactForm');
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const email = document.getElementById('email');
const phoneNumber = document.getElementById('phone');
const contactList = document.createElement('div');
contactList.id = 'contact-list';
document.body.appendChild(contactList);
const manager = new ContactManager();
let editId = null;
function renderContacts() {
    contactList.innerHTML = '';
    const contacts = manager.getContacts();
    contacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contactDiv');
        contactDiv.innerHTML = `
        <p> ${contact.firstName} ${contact.lastName} </p><br>
        <p>Email: ${contact.email}</p><br>
        Phone: ${contact.phoneNumber}</br>
        <button data-id =${contact.id} class="edit-btn"> Edit</button>
        <button data-id =${contact.id} class="delete-btn"> Delete</button>
        `;
        contactList.append(contactDiv);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            manager.deleteContact(id);
            renderContacts();
        });
    });
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const contact = manager.getContacts().find(c => c.id === id);
            if (contact) {
                firstName.value = contact.firstName;
                lastName.value = contact.lastName;
                email.value = contact.email;
                phoneNumber.value = contact.phoneNumber;
                editId = contact.id;
            }
            else {
                console.log(`Contact id ${id} not found`);
            }
        });
    });
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const contact = new Contact(editId !== null && editId !== void 0 ? editId : Date.now(), firstName.value.trim(), lastName.value.trim(), email.value.trim(), phoneNumber.value.trim());
    if (editId) {
        manager.updateContact(contact);
        editId = null;
    }
    else {
        manager.addContact(contact);
    }
    form.reset();
    renderContacts();
});
renderContacts();
