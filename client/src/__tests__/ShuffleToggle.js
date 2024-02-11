import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ShuffleToggle from '../components/ShuffleToggle';

test('renders ShuffleToggle component with default checked', () => {
	const handleChange = jest.fn();
	render(<ShuffleToggle label="My playlists only" value={true} onChange={handleChange} />);

	// Assert initial value
	const valueElement = screen.getByText('ON');
	expect(valueElement).toBeInTheDocument();

	// Assert checkbox
	const checkboxElement = screen.getByLabelText('My playlists only');
	expect(checkboxElement).toBeInTheDocument();
	expect(checkboxElement).toBeChecked();

	// Simulate change event
	fireEvent.click(checkboxElement);

  	// Assert updated value
	expect(handleChange).toHaveBeenCalledTimes(1);
	handleChange.mockImplementation((e) => {
		expect(e.target.checked).toBe(false);
		expect(e.target.value).toBe('OFF');
	})
});

test('renders ShuffleToggle component with default not checked', () => {
	const handleChange = jest.fn();
	render(<ShuffleToggle label="My playlists only" value={false} onChange={handleChange} />);

	// Assert initial value
	const valueElement = screen.getByText('OFF');
	expect(valueElement).toBeInTheDocument();

	// Assert checkbox
	const checkboxElement = screen.getByLabelText('My playlists only');
	expect(checkboxElement).toBeInTheDocument();
	expect(checkboxElement).not.toBeChecked();

	// Simulate change event
	fireEvent.click(checkboxElement);

  	// Assert updated value
	expect(handleChange).toHaveBeenCalledTimes(1);
	handleChange.mockImplementation((e) => {
		expect(e.target.checked).toBe(true);
		expect(e.target.value).toBe('ON');
	})
});
