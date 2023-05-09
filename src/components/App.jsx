  import React, { Component } from "react";
  import { nanoid } from 'nanoid';
  import { Phonebook, Container } from './App.styled';
  import ContactForm from './ContactForm/ContactForm';
  import Filter from './Filter/Filter';
  import ContactList from './ContactList/ContactList';
  import initialContacts from '../contacts.json';
  
  export class App extends Component {
    state = {
      contacts: [],
      filter: '',
    }

    componentDidMount() {
      const savedContacts = localStorage.getItem('contacts')
      if (savedContacts !== null) {
        const parsedContacnts = JSON.parse(savedContacts);
        this.setState( { contacts: parsedContacnts });
        return;
      }
      this.setState({ contacts: initialContacts });
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState.contacts !== this.state.contacts) {
        localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
      }
    }

    handleChange = event => {
      const { name, value } = event.currentTarget;
      this.setState({ [name]: value });
    };

    handleSubmit = (values, resetForm) => {
      const { name, number } = values;

      const isContactExist = this.state.contacts.some(
        contact => contact.name === name.value
      );
    
      if (isContactExist) {
        alert(`${name.value} is already in contacts`);
        resetForm();
        return;
      }

      const newContact = {
        id: nanoid(10),
        name: name,
        number: number
      };

      this.setState(prevState => ({
        contacts: [newContact, ...prevState.contacts],
      }));

      resetForm();
    };

    deleteContacts = contactId => {
      this.setState(prevState => ({
        contacts: prevState.contacts.filter(contact => contact.id !== contactId),
      }));
    };

    render() {
      const filteredContacts = this.state.contacts.filter(contact => {
        return contact.name ? contact.name.toLowerCase().includes(this.state.filter.toLowerCase()) : false;
      });

      return (
        <Phonebook >
          <Container>
            <h1>Phonebook</h1>
            <ContactForm onSubmit={(values, {resetForm}) => this.handleSubmit(values, resetForm)} /> 
            <h2>Contacts</h2>
            <Filter value={this.state.filter} onChange={this.handleChange} />
            <ContactList contacts={filteredContacts} onDeleteContacts={this.deleteContacts} />
          </Container>
        </Phonebook>
      );
    }
  };
