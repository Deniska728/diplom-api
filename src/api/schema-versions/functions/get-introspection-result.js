import axios from 'axios';

const IntrospectionQuery = {
  query: `
    query IntrospectionQuery {
      __schema {
        queryType { name, description }
        mutationType { name, description }
        subscriptionType { name, description }
        types {
          ...FullType
        }
        directives {
          name
          description
          locations
          args {
            ...InputValue
          }
        }
      }
    }
    fragment FullType on __Type {
      kind
      name
      description
      fields(includeDeprecated: true) {
        name
        description
        args {
          ...InputValue
        }
        type {
          ...TypeRef
        }
        isDeprecated
        deprecationReason
      }
      inputFields {
        ...InputValue
      }
      interfaces {
        ...TypeRef
      }
      enumValues(includeDeprecated: true) {
        name
        description
        isDeprecated
        deprecationReason
      }
      possibleTypes {
        ...TypeRef
      }
    }
    fragment InputValue on __InputValue {
      name
      description
      type { ...TypeRef }
      defaultValue
    }
    fragment TypeRef on __Type {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
          }
        }
      }
    }
  `,
};

const getIntrospectionResult = async ({ endpoint, apiKey, apiKeyName }) => {
  const headers = {};

  if (apiKey && apiKeyName) {
    headers[apiKeyName] = apiKey;
  }

  axios
    .post(endpoint, IntrospectionQuery, { headers })
    .then((response) => response.data.data.__schema)
    .catch((err) => {
      console.log(err);
    });
};

export default getIntrospectionResult;
