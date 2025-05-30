interface ContactData {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

class Contact {
    constructor(public id: number, public firstName: string, public lastName: string, public email: string, public phoneNumber: string) {
    }
}

class ContactManager {
    private contacts: Contact[] = [];

    constructor() {
        this.loadFromStorage();
    }

    addContact(contact: Contact) {
        this.contacts.push(contact);
        this.saveToStorage()
    }

    updateContact(updated: Contact) {
        const index = this.contacts.findIndex(contact => contact.id === updated.id);
        if (index > -1) {
            this.contacts[index] = updated;
            this.saveToStorage();
        }
    }

    deleteContact(id: number) {
        this.contacts = this.contacts.filter(c => c.id !== id);
        this.saveToStorage()
    }

    getContacts(): Contact[] {
        return this.contacts;
    }

    private saveToStorage() {
        localStorage.setItem("contacts", JSON.stringify(this.contacts));
    }

    private loadFromStorage() {
        const data = localStorage.getItem("contacts");
        if (data) {
            this.contacts = JSON.parse(data);
        }
    }
}

const form = document.getElementById('contactForm') as HTMLFormElement;
const firstName = document.getElementById('first-name') as HTMLInputElement;
const lastName = document.getElementById('last-name') as HTMLInputElement;
const email = document.getElementById('email') as HTMLInputElement;
const phoneNumber = document.getElementById('phone') as HTMLInputElement;


const contactList = document.createElement('div');
contactList.id = 'contact-list';
document.body.appendChild(contactList);

const manager = new ContactManager();
let editId: number | null = null;

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
            const id: number = parseInt( (e.target as HTMLElement).getAttribute('data-id')!) ;
            manager.deleteContact(id);
            renderContacts();
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id: number = parseInt((e.target as HTMLElement).getAttribute('data-id')!) ;
            const contact = manager.getContacts().find(c => c.id === id)!;
            if (contact) {
                firstName.value = contact.firstName;
                lastName.value = contact.lastName;
                email.value = contact.email;
                phoneNumber.value = contact.phoneNumber;
                editId = contact.id;
            } else  {
                console.log(`Contact id ${id} not found`);
            }

        });
    });
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const contact = new Contact(
        editId ?? Date.now(),
        firstName.value.trim(),
        lastName.value.trim(),
        email.value.trim(),
        phoneNumber.value.trim(),
    );
    if (editId) {
        manager.updateContact(contact);
        editId = null;
    } else {
        manager.addContact(contact);
    }
    form.reset();
    renderContacts();
});

renderContacts();