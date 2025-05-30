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
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phoneNumber = document.getElementById('phone');
const table = document.createElement('table');
table.innerHTML = `
  <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody id="contact-tbody"></tbody>
`;
document.body.appendChild(table);
const tbody = document.getElementById('contact-tbody');
const manager = new ContactManager();
let editId = null;
function renderContacts() {
    tbody.innerHTML = '';
    const contacts = manager.getContacts();
    console.log(contacts);
    if (contacts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No contacts yet</td></tr>';
    }
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        row.innerHTML = `
             <td>${contact.firstName} ${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>
                <button class="edit-btn" data-id="${contact.id}">Edit</button>
                <button class="delete-btn" data-id="${contact.id}">Delete</button>
            </td>
        `;
        tbody.append(row);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            // const user: ContactManager = new ContactManager();
            // user.getContacts().forEach((contact: Contact) => {
            //     const name: string = contact.firstName.toUpperCase();
            // }
            if (confirm(`Delete contact: ${id}`)) { //todo-change to show name instead of id
                manager.deleteContact(id);
                renderContacts();
            }
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
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.textContent = 'Update Contact';
        });
    });
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const contact = new Contact(editId !== null && editId !== void 0 ? editId : Date.now(), firstName.value.trim(), lastName.value.trim(), email.value.trim(), phoneNumber.value.trim());
    if (editId) {
        manager.updateContact(contact);
        editId = null;
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.textContent = 'Add Contact';
    }
    else {
        manager.addContact(contact);
    }
    form.reset();
    renderContacts();
});
renderContacts();
