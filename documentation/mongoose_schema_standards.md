# Team Schema Standards Template

## Collection Name: <collection_name>
Schema Name: <schema_name>
Timestamps: <true/false>

---

## Field Guidelines
| Field Name | Type | Required | Unique | Validation | Min Length | Max Length | Regex / Format | Trim | Example |
|------------|------|----------|--------|------------|------------|------------|----------------|------|---------|
| <field_name> | <String / Number / Date / Boolean / Array / ObjectId> | <true/false> | <true/false> | <custom validation function or regex> | <min> | <max> | <regex> | <true/false> | <example value> |

---

## Validation Rules & Best Practices

1. **Required Fields**
   - Always use descriptive messages:
     ```js
     required: [true, 'Please provide <field_name>']
     ```

2. **String Fields**
   - Use `trim: true` to remove whitespace.
   - Enforce `minlength` and `maxlength` where applicable.
   - Use regex for format constraints (e.g., only letters, emails, phone numbers).

3. **Unique Fields**
   - Enforce uniqueness at the schema level for fields like emails or usernames:
     ```js
     unique: true
     ```

4. **Custom Validation**
   - Use `validator` library for standard checks (emails, URLs, etc.).
   - Regex can enforce specific patterns for passwords, phone numbers, or codes.

5. **Passwords**
   - Minimum 10 characters.
   - Must include: at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.
   - Always store **hashed**, never plain text.

6. **Timestamps**
   - Enable `timestamps: true` for `createdAt` and `updatedAt`.
   - Helpful for audit trails and record updates.

7. **Naming Conventions**
   - Use **camelCase** for field names.
   - Use descriptive names that indicate purpose.

8. **Arrays / References**
   - For arrays of sub-documents, validate individual items if necessary.
   - For ObjectId references, use `ref` to link to other collections.

---

## Example Schema Using Template
```js
const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 2,
    maxlength: 50,
    trim: true,
    match: /^[A-Za-z\s\-]+$/ // letters, spaces, hyphens
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: v => validator.isEmail(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 10,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>/?]).{10,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ]
  }
}, {
  timestamps: true
});
```

