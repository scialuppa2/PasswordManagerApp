import React from 'react';
import Spinner from '../Spinner/Spinner';
import './MyForm.css';

const MyForm = ({ fields, onSubmit, loading, register, errors, isValid }) => {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <input
            type={field.type}
            className="form-control"
            placeholder={field.placeholder}
            {...register(field.name, {
              ...field.validation,
              validate: field.validation.validate ? (value) => field.validation.validate(value) : undefined,
            })}
          />
          {errors[field.name] && <div className="validation-message">{errors[field.name].message}</div>}
        </div>
      ))}
      {loading ? (
        <Spinner />
      ) : (
        <button 
          className="btn btn-signup mt-3" 
          type="submit" 
          disabled={!isValid}
        >
          Confirm
        </button>
      )}
    </form>
  );
};

export default MyForm;
