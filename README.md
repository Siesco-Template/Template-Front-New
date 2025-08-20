# Template

# Requirements

- Use TypeScript ≥ 5.2.
- Use Node.js ≥ 20.

# Services

## Creating and Using Services in Your Application

In this docs explains how to create and use services for handling API requests using `httpRequest` and `authRequest`. It covers defining API endpoints, setting up service classes, and making HTTP requests efficiently.

### 1. Defining API Endpoints

To maintain clean and reusable code, define API endpoints in a central configuration file.

### Example: API Configuration

```ts
const GATEWAY = {
    auth: '/auth',
    myTruck: '/mayTruck',
} as const;

const API_CONTROLLER = {
    auth: (url = '') => `${GATEWAY.auth}/Auth${url}`,
    cargos: (url = '') => `${GATEWAY.myTruck}/Cargos${url}`,
    truck: (url = '') => `${GATEWAY.myTruck}/Truck${url}`,
};

export default API_CONTROLLER;
```

- `GATEWAY` contains the base paths for different services.
- `API_CONTROLLER` defines helper functions for constructing full API URLs dynamically.

### 2. Implementing Service Classes

A service class encapsulates API calls related to a specific domain, such as authentication or cargo management. This approach improves reusability and maintainability.

### Example: `AuthService`

```ts
import { IRegisterResponse } from '@/pages/(auth)/register/register-form';

import { httpRequest } from '@/services/api';
import API_CONTROLLER from '@/services/config/api.config';

import type { ILoginBody, ILoginResponse, IRegisterBody, ITokens } from './auth.service.types';

export default class AuthService {
    authUrl = (endpoint = '') => API_CONTROLLER.auth(endpoint);

    async login(bodyData?: ILoginBody) {
        return httpRequest<ILoginResponse>(this.authUrl('/Login'), {
            method: 'POST',
            body: bodyData,
        });
    }

    async register(bodyData: IRegisterBody) {
        return httpRequest<IRegisterResponse>(this.authUrl('/Register'), {
            method: 'POST',
            body: bodyData,
        });
    }

    async refreshToken(refreshToken: string) {
        return httpRequest<ITokens>(this.authUrl('/LoginWithRefreshToken'), {
            method: 'POST',
            queryParams: { refreshToken },
        });
    }
}
```

### Breakdown:

- **`authUrl(endpoint)`**: Constructs API URLs dynamically.
- **`login(bodyData)`**: Sends a POST request to authenticate a user.
- **`register(bodyData)`**: Sends a POST request to register a new user.
- **`refreshToken(refreshToken)`**: Sends a request to refresh authentication tokens.

## 3. Making API Calls with `httpRequest`

### `httpRequest` Utility Function

`httpRequest` is a wrapper around `fetch` or another HTTP client, ensuring consistent error handling and request processing.

```ts
export async function httpRequest<T>(
    url: string,
    options: RequestInit & { queryParams?: Record<string, any> }
): Promise<T> {
    const queryString = options.queryParams ? '?' + new URLSearchParams(options.queryParams).toString() : '';

    const response = await fetch(url + queryString, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}
```

### Usage Example:

```ts
const authService = new AuthService();

// Logging in
authService
    .login({ username: 'testUser', password: 'securePassword' })
    .then((response) => console.log('Login successful:', response))
    .catch((error) => console.error('Login failed:', error));

// Registering a user
authService
    .register({ username: 'newUser', email: 'test@example.com', password: 'securePassword' })
    .then((response) => console.log('Registration successful:', response))
    .catch((error) => console.error('Registration failed:', error));

// Refreshing token
authService
    .refreshToken('existing-refresh-token')
    .then((tokens) => console.log('Token refreshed:', tokens))
    .catch((error) => console.error('Token refresh failed:', error));
```

# Permission

This module manages user permissions and access control across the application. It includes services for fetching user permissions, a context for managing permission state, and a guard component to conditionally render UI elements based on user permissions.

## PermissionService

`PermissionService` provides methods to interact with the API to fetch user permissions.

**Methods:**

- `getCurrentUserPermissions()`

    - Makes a `GET` request to `/Permissions/GetCurrentUserPermissions` to retrieve the current user's permissions.
    - Returns a `Promise<PermissionData>`.

**Example Usage:**

```typescript
import { PermissionService } from './permission.service';

async function fetchPermissions() {
    try {
        const permissions = await PermissionService.getCurrentUserPermissions();
        console.log(permissions);
    } catch (error) {
        console.error('Error fetching permissions', error);
    }
}
```

---

## PermissionContext

Provides a context for managing permission state throughout the application.

**Context Value:**

- `isLoading: boolean` – Indicates whether permissions are being fetched.
- `permissions: Permission[] | null` – The user's permissions.

**Example Usage:**

```tsx
import { usePermission } from './PermissionContext';

const MyComponent = () => {
    const { isLoading, permissions } = usePermission();

    if (isLoading) return <div>Loading permissions...</div>;
    return <div>{JSON.stringify(permissions)}</div>;
};
```

---

## PermissionGuard Component

`PermissionGuard` is a component that conditionally renders its children based on the user's permissions.

**Props:**

- `permissionKey: string` – The key representing the required permission in the format `Entity/Action` (e.g., `User/getAll`).

**Example Usage:**

```tsx
import { PermissionGuard } from './PermissionGuard';

const MyProtectedComponent = () => (
    <PermissionGuard permissionKey="User/getAll">
        <div>Only visible to users with 'User/getAll' permission</div>
    </PermissionGuard>
);
```

---

### hasPermission

A utility function that checks if a specific permission key is present in the user's permissions.

**Parameters:**

- `permissions: Permission[] | undefined` – The list of user permissions.
- `permissionKey: string` – The key representing the required permission.

**Returns:**

- `boolean` – Whether the user has the required permission.

**Example Usage:**

```typescript
import { hasPermission } from './permission.utils';

const userHasAccess = hasPermission(userPermissions, 'Applications-Edit');
console.log('User has access:', userHasAccess);
```

# API Helpers

This docs examples explains how to use the `useQuery` and `useMutation` hooks for handling API requests efficiently in a React application.

### `useQuery` Hook

The `useQuery` hook is used to fetch data from an API and manage its loading, error, and data states.

#### Usage:

```tsx
import AuthService from './path-to-auth-service';
import { useQuery } from './path-to-hooks';

const MyComponent = () => {
    const { data, error, loading, refetch } = useQuery({
        key: 'user',
        fn: () => AuthService.login({ username: 'test', password: 'password' }),
        initial: { data: null, loading: 'pending' },
        then: (response) => response.user,
        onSuccess: (data) => console.log('Fetched Data:', data),
        catch: (error) => console.error('Error:', error),
        retry: 2,
    });

    if (loading === 'pending') return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <div>
            <h1>Welcome, {data?.name}</h1>
            <button onClick={refetch}>Refetch</button>
        </div>
    );
};
```

#### Props:

- `key`: Unique identifier for the query.
- `fn`: The function that fetches data.
- `initial`: Initial state for `data` and `loading`.
- `then`: Optional transformation function for the response.
- `onSuccess`: Callback triggered when the request is successful.
- `catch`: Callback triggered when the request fails.
- `retry`: Number of times the request should be retried in case of failure.

---

### `useMutation` Hook

The `useMutation` hook is used for handling data modifications like login, register, and form submissions.

#### Usage:

```tsx
import { useMutation } from './path-to-hooks';
import AuthService from './path-to-auth-service';

const LoginComponent = () => {
    const authService = new AuthService();
    const { data, error, loading, isPending, submitHandler } = useMutation<IRegisterBody, IRegisterResponse>({
        fn: (body) => authService.login(body),
        transform: (response) => response.token,
        onSuccess: (data) => return data.result,
        onError: (error) => console.error('Login failed:', error),
        retry: 2,
    });

    const handleLogin = () => {
        submitHandler({ username: 'test', password: 'password' });
    };

    return (
        <div>
            {loading === 'pending' && <p>Logging in...</p>}
            {error && <p>Error: {error}</p>}
            <button onClick={handleLogin} disabled={isPending}>Login</button>
        </div>
    );
};
```

#### Props:

- `fn`: The function that performs the mutation (e.g., login request).
- `transform`: Function to transform response data before setting state.
- `onSuccess`: Callback executed when mutation is successful.
- `onError`: Callback executed when mutation fails.
- `retry`: Number of retry attempts in case of failure.

# Components

Components in @/shared/ui

## Image

### Basic Image Usage

```tsx
import { S_Image } from '@/ui';

<S_Image src="path-to-image" alt="Image description" width="50px" height="50px" />;
```

#### Props

| Prop                    | Type         | Default    | Description                                                                                                                                    |
| :---------------------- | :----------- | :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| onLoad                  | `Function`   |            | Function called when the image has been loaded. This is the same function as the `onLoad` of an `<img>` which contains an event object.        |
| afterLoad               | `Function`   |            | Deprecated, use `onLoad` instead. This prop is only for backward compatibility.                                                                |
| beforeLoad              | `Function`   |            | Function called right before the placeholder is replaced with the image element.                                                               |
| delayMethod             | `String`     | `throttle` | Method from lodash to use to delay the scroll/resize events. It can be `throttle` or `debounce`.                                               |
| delayTime               | `Number`     | 300        | Time in ms sent to the delayMethod.                                                                                                            |
| effect                  | `String`     |            | Name of the effect to use. Please, read next section with an explanation on how to use them.                                                   |
| placeholder             | `ReactClass` | `<span>`   | React element to use as a placeholder.                                                                                                         |
| placeholderSrc          | `String`     |            | Image src to display while the image is not visible or loaded.                                                                                 |
| threshold               | `Number`     | 100        | Threshold in pixels. So the image starts loading before it appears in the viewport.                                                            |
| useIntersectionObserver | `Boolean`    | true       | Whether to use browser's IntersectionObserver when available.                                                                                  |
| visibleByDefault        | `Boolean`    | false      | Whether the image must be visible from the beginning.                                                                                          |
| wrapperClassName        | `String`     |            | In some occasions (for example, when using a placeholderSrc) a wrapper span tag is rendered. This prop allows setting a class to that element. |
| wrapperProps            | `Object`     | null       | Props that should be passed to the wrapper span when it is rendered (for example, when using placeholderSrc or effect)                         |
| ...                     |              |            | Any other image attribute                                                                                                                      |

### Using effects

`LazyLoadImage` includes several effects ready to be used, they are useful to add visual candy to your application, but are completely optional in case you don't need them or want to implement you own effect.

They rely on CSS and the corresponding CSS file must be imported:

```javascript
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const MyImage = ({ image }) => (
    <LazyLoadImage
        alt={image.alt}
        effect="blur"
        wrapperProps={{
            // If you need to, you can tweak the effect transition using the wrapper style.
            style: { transitionDelay: '1s' },
        }}
        src={image.src}
    />
);
```

The current available effects are:

- `blur`: renders a blurred image based on `placeholderSrc` and transitions to a non-blurred one when the image specified in the src is loaded.

![Screenshot of the blur effect](https://user-images.githubusercontent.com/3616980/37790728-9f95529a-2e07-11e8-8ac3-5066c065e0af.gif)

- `black-and-white`: renders a black and white image based on `placeholderSrc` and transitions to a colorful image when the image specified in the src is loaded.

![Screenshot of the black-and-white effect](https://user-images.githubusercontent.com/3616980/37790682-864e58d6-2e07-11e8-8984-ad5d7b056d9f.gif)

- `opacity`: renders a blank space and transitions to full opacity when the image is loaded.

![Screenshot of the opacity effect](https://user-images.githubusercontent.com/3616980/37790755-b48a704a-2e07-11e8-91c3-fcd43a91e7b1.gif)

## Button

### Props

| Prop        | Type                                                                                                                               | Default     | Description                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `as`        | `'button' \| 'link'`                                                                                                               | `'button'`  | Determines whether the component renders as a `<button>` or `<Link>` (Next.js link). |
| `variant`   | `'main-10' \| 'main-20' \| 'main-30' \| 'outlined-10' \| 'outlined-20' \| 'outlined-30' \| 'ghost-10' \| 'ghost-20' \| 'ghost-30'` | `'main-20'` | Defines the button style variant.                                                    |
| `color`     | `'primary' \| 'secondary' \| 'red' \| 'green'`                                                                                     | `'primary'` | Sets the color scheme of the button.                                                 |
| `children`  | `ReactNode`                                                                                                                        | `undefined` | Button label or icon.                                                                |
| `className` | `string`                                                                                                                           | `''`        | Additional CSS classes for customization.                                            |
| `disabled`  | `boolean`                                                                                                                          | `false`     | Disables the button when `true`.                                                     |

### Usage Examples

#### Basic Button Usage

```tsx
<S_Button>Click Me</S_Button>
```

#### Button with Custom Variant and Color

```tsx
<S_Button variant="main-30" color="red">
    Delete
</S_Button>
```

#### Disabled Button

```tsx
<S_Button disabled>Disabled</S_Button>
```

#### Link Button

```tsx
<S_Button as="link" href="/about">
    Go to About Page
</S_Button>
```

### How to Add a New Button Style

To add a new button style, follow these steps:

#### 1. Define the New CSS Class in `button.module.css`

Add a new class following the existing structure in `button.module.css`:

```css
.new-variant-10-primary {
    border-radius: var(--r-300);
    padding: var(--pm-350) var(--pm-400);
    min-width: calc(var(--wh-300) * 3);
    font-size: var(--fs-100);
    background: hsl(var(--clr-primary-500));
    color: hsl(var(--clr-white));
}
.new-variant-10-primary:hover {
    background: hsl(var(--clr-primary-300));
}
```

#### 2. Update the `IButtonVariant` Type

Modify the `IButtonVariant` type in `Button.tsx` to include the new variant:

```tsx
type IButtonVariant =
    | 'main-10'
    | 'main-20'
    | 'main-30'
    | 'outlined-10'
    | 'outlined-20'
    | 'outlined-30'
    | 'ghost-10'
    | 'ghost-20'
    | 'ghost-30'
    | 'new-variant-10'; // Add new variant here
```

#### 3. Use the New Variant in the Component

Now, you can use the new variant in your project:

```tsx
<S_Button variant="new-variant-10" color="primary">
    New Button
</S_Button>
```

## Input

The Input component is a reusable form input field built using @ark-ui/react. It provides built-in support for labels, descriptions, details, error handling, and size variants.

### Props

| Prop Name          | Type                                                                  | Default     | Description                                        |
| ------------------ | --------------------------------------------------------------------- | ----------- | -------------------------------------------------- |
| `label`            | `string`                                                              | `''`        | The text displayed as the input label.             |
| `labelProps`       | `Field.LabelProps`                                                    | `undefined` | Additional props for the label.                    |
| `details`          | `string`                                                              | `undefined` | Additional details displayed next to the label.    |
| `detailsProps`     | `DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>` | `undefined` | Props for the details span element.                |
| `description`      | `string`                                                              | `undefined` | A helper text displayed below the input.           |
| `descriptionProps` | `Field.HelperTextProps`                                               | `undefined` | Additional props for the helper text.              |
| `errorText`        | `string`                                                              | `undefined` | The error message displayed when validation fails. |
| `inputSize`        | `'default' \| 'medium' \| 'small'`                                    | `'medium'`  | Controls the input size.                           |
| `rootProps`        | `Field.RootProps`                                                     | `undefined` | Props for the root wrapper.                        |

### Usage

```tsx
import { S_Input } from '@/ui';

function App() {
    return (
        <S_Input
            label="Username"
            details="Must be unique"
            description="Enter a unique username."
            inputSize="default"
            errorText="Username is required"
        />
    );
}
export default App;
```

### Error Handling

- If `errorText` is provided, the input field and error message will be styled accordingly.
- When an error occurs, the `data-error` attribute is set to `true`, changing the border color and displaying the error message.

### Styling

The component uses CSS variables for theming:

```css
.input[data-part='root'] {
    display: flex;
    flex-direction: column;
    gap: var(--pm-200);
}

.input [data-part='input-header-wrapper'] {
    display: flex;
    justify-content: space-between;
}

.input [data-part='input'] {
    border: 1px solid hsl(var(--clr-secondary-400));
    font-size: var(--fs-200);
    padding: 0 var(--pm-400);
}

.input [data-part='error-text'][data-error='true'] {
    color: hsl(var(--clr-red-400));
}

.input [data-part='input'][data-error='true'] {
    border: 1px solid hsl(var(--clr-red-400));
}
```

### Customization

- Modify `inputSize` for different input field sizes (`default`, `medium`, `small`).
- Use `labelProps`, `detailsProps`, and `descriptionProps` for additional customization.
- Customize styles via the provided CSS class names and data attributes.

### Accessibility

- The component properly associates labels and inputs.
- The `aria-invalid` attribute is set dynamically based on error presence.

## RadioGroup

### Props

| Prop         | Type                                                          | Default   | Description                                                                              |
| ------------ | ------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------- |
| groupData    | Array<string \| IRadioGroupItemValue \| IRadioGroupItemLabel> | []        | List of radio options. Can be strings or objects with id, name, and disabled properties. |
| label        | string                                                        | ''        | Label for the radio group.                                                               |
| color        | 'default' \| 'primary'                                        | 'default' | Controls the color theme of the radio buttons.                                           |
| variant      | 'default' \| 'primary'                                        | 'default' | Defines the visual variant of the radio group.                                           |
| defaultValue | string \| number                                              | undefined | Specifies the default selected radio button (for uncontrolled usage).                    |
| value        | string \| number                                              | undefined | Specifies the controlled value (must be used with onChange).                             |
| onChange     | (value: string) => void                                       | undefined | Callback triggered when the selected radio button changes.                               |

### Usage

#### Basic Usage

```tsx
import { S_RadioGroup } from '@/ui';

const App = () => {
    return (
        <S_RadioGroup
            label="Select an option"
            groupData={['Option 1', 'Option 2', 'Option 3']}
            defaultValue="Option 2"
        />
    );
};
export default App;
```

#### Using Objects for Options

```tsx
const options = [
    { id: '1', name: 'Option A' },
    { id: '2', name: 'Option B', disabled: true },
    { id: '3', name: 'Option C' },
];
<S_RadioGroup label="Pick One" groupData={options} defaultValue="3" />;
```

#### Controlled vs. Uncontrolled

##### Controlled Component

```tsx
const [selected, setSelected] = useState("2");
return (
    <S_RadioGroup
        groupData={["Option 1", "Option 2", "Option 3"]}
        value={selected}
        onChange={setSelected}
    />
);
```

##### Uncontrolled Component

```tsx
<S_RadioGroup groupData={['Option 1', 'Option 2', 'Option 3']} defaultValue="Option 1" />
```

### How to Retrieve Selected Value

```tsx
const handleChange = (value: string) => {
    console.log('Selected Value:', value);
};

<S_RadioGroup groupData={['Red', 'Blue', 'Green']} onChange={handleChange} />;
```

### Adding New Colors & Variants

The `color` and `variant` props allow customization of the radio buttons. You can define additional styles in `radio-group.css`:

```css
.radio-group-comp {
    display: flex;
    flex-direction: column;
    gap: var(--pm-100);
}

.radio-group-comp [data-part='item'] {
    display: flex;
    align-items: center;
    gap: var(--pm-100);
    cursor: pointer;
    color: hsl(var(--clr-grey-700));
}

.radio-group-comp [data-part='item-control'] {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid hsl(var(--clr-grey-700));
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease-in-out;
}

.radio-group-comp.variant-default [data-part='item-control'][data-state='checked'] {
    border: 1px solid hsl(var(--clr-background));
    background-color: hsl(var(--clr-background));
    outline: 4px solid hsl(var(--clr-blue-500));
    outline-offset: -4px;
}

.radio-group-comp.variant-primary [data-part='item-control'][data-state='checked'] {
    border: 1px solid hsl(var(--clr-blue-500));
    background-color: hsl(var(--clr-blue-500));
    outline: 3px solid hsl(var(--clr-background));
    outline-offset: -4px;
}
```

Then, use it:

```tsx
<S_RadioGroup groupData={['A', 'B', 'C']} color="primary" variant="primary" />
```

### Accessibility

- Uses `aria-invalid` when an error occurs.
- Includes hidden inputs for screen reader support.
- Provides proper focus styles for keyboard navigation.

## Switch

### Props

| Prop Name      | Type                     | Default     | Description                                    |
| -------------- | ------------------------ | ----------- | ---------------------------------------------- |
| `label`        | `string`                 | `undefined` | The text displayed next to the switch.         |
| `labelProps`   | `SwitchLabelProps`       | `undefined` | Additional props for the label.                |
| `controlProps` | `SwitchControlProps`     | `undefined` | Props for the switch control (container).      |
| `thumbProps`   | `SwitchThumbProps`       | `undefined` | Props for the switch thumb (toggle indicator). |
| `color`        | `'primary' \| 'blue'`    | `'blue'`    | Defines the switch color theme.                |
| `variant`      | `'default' \| 'primary'` | `'default'` | Defines the visual style of the switch.        |
| `className`    | `string`                 | `''`        | Additional class names for styling.            |

### Usage

#### Basic Usage

```tsx
import { S_Switch } from '@/ui';

function App() {
    return <S_Switch label="Enable notifications" />;
}
export default App;
```

#### Custom Colors and Variants

```tsx
<S_Switch label="Dark Mode" color="primary" variant="primary" />
```

### Styling

The switch component uses CSS variables and utility classes to control its appearance. Key styles include:

- `data-color="primary"` or `data-color="blue"` for color themes.
- `data-hover`, `data-active`, and `data-checked` states for interactions.
- `variant-default` or `variant-primary` for different styles.

#### Example Customization (CSS)

```css
.switch[data-color='primary'] [data-part='control'] {
    background-color: hsl(var(--clr-primary-400));
}

.switch[data-color='blue'] [data-part='control'] {
    background-color: hsl(var(--clr-blue-400));
}
```

### Accessibility

- Uses `aria-checked` for screen readers.
- `HiddenInput` ensures proper form integration.
- Supports keyboard and mouse interactions.

## Select

### Features

- Supports single and multiple selections.
- Customizable with different variants (`default` and `checkbox`).
- Supports async data loading (`pending`, `success`, `error` states).
- Allows filtering of items.

### Props

| Prop                 | Type                                          | Description                                                       |
| -------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| `items`              | `I_CollectionItem[]`                          | List of items to display in the select dropdown.                  |
| `loadingStatus`      | `'pending' \| 'success' \| 'error'`           | Determines loading state of the select options.                   |
| `label`              | `string`                                      | Label for the select field.                                       |
| `selectItemsLabel`   | `string`                                      | Label for the dropdown list.                                      |
| `variant`            | `'default' \| 'checkbox'`                     | Determines whether selection uses checkboxes or default behavior. |
| `onChange`           | `(selectedItems: I_CollectionItem[]) => void` | Callback fired when selection changes.                            |
| `selectedItems`      | `I_CollectionItem[]`                          | Pre-selected items.                                               |
| `multiple`           | `boolean`                                     | Enables multi-selection mode.                                     |
| `onInputValueChange` | `(value: string) => void`                     | Callback fired when input value changes.                          |

## Usage

#### Basic Usage

```tsx
import { S_Select } from '@/ui';

const items = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3', disabled: true },
];

export default function Example() {
    const handleChange = (selectedItems) => {
        console.log('Selected items:', selectedItems);
    };

    return <S_Select label="Select an option" items={items} loadingStatus="success" onChange={handleChange} />;
}
```

#### Multi-Select with Checkboxes

```tsx
<S_Select label="Choose Options" items={items} multiple variant="checkbox" onChange={handleChange} />
```

#### Handling Input Filtering

```tsx
<S_Select label="Search Options" items={items} onInputValueChange={(value) => console.log('Input value:', value)} />
```

### Customization

You can style the component using CSS modules. The `styles.select` class can be customized in `select.module.css`.

```css
.select {
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
}
```

# Icons

https://drive.google.com/drive/folders/1i3aQkku1bozTvhTAlsR_37JL5ldChFZm?usp=sharing

on this drive have all icon packs we use, if you need icon get on this drive and download icon what you need. After download add this icon on @/shared/icons and open ide or vscode this icon if on icon have #hex color or etc change this to `currentColor` because if you don't do this on css you don't change icon color

### Icons should be used on client side ("use client")
