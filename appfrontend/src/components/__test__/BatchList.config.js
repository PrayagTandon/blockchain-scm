import { render, screen } from '@testing-library/react';
import BatchList from '../BatchList';

test('renders batch list', () => {
    render(<BatchList batches={[]} />);
    expect(screen.getByText(/No batches found/i)).toBeInTheDocument();
});