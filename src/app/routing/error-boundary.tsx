import { useRouteError } from 'react-router';

const ErrorBoundary = () => {
    const error = useRouteError();
    console.log(error);
    return <div>Problem baş verdi</div>;
};

export default ErrorBoundary;
