import { gql } from '@apollo/client';

export const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
        personId
      }
    }
  }
`;

export const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
      id
    }
  }
`;

export const EDIT_PERSON = gql`

  mutation EditPerson($id: ID!, $firstName: String!, $lastName: String!) {
    editPerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
    }
  }
`;

export const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

export const GET_CARS = gql`
  query GetCars {
    cars {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export const ADD_CAR = gql`
  mutation AddCar($year: String!, $make: String!, $model: String!, $price: String!, $personId: ID!) {
    addCar(year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
    }
  }
`;

export const EDIT_CAR = gql`
  mutation EditCar($id: ID!, $year: String!, $make: String!, $model: String!, $price: String!, $personId: ID!) {
    editCar(id: $id, year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
    }
  }
`;

export const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
    }
  }
`;

export const GET_PERSON_WITH_CARS = gql`
  query GetPersonWithCars($id: ID!) {
    personWithCars(id: $id) {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
        personId
      }
    }
  }
`;

