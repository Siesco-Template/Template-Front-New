import { useState } from 'react';

import { CodeIcon, InfoIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';

import { CheckedChangeDetails } from '@ark-ui/react/dist/components/checkbox/checkbox';

import {
    S_Avatar,
    S_Badge,
    S_Button,
    S_Checkbox,
    S_ContextMenu2,
    S_Drawer,
    S_Image,
    S_Input,
    S_InputPassword,
    S_InputWithIcon,
    S_Pagination,
    S_RadioGroup,
    S_Select,
    S_SidePanel,
    S_Slider,
    S_Switch,
    S_Textarea,
    S_Tooltip,
} from '@/ui';
import S_Select_Simple from '@/ui/select/select-simple';

// Sample data for components
const RADIO_ITEMS = [
    { id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' },
    { id: 3, label: 'Option 3', disabled: true },
    { id: 4, label: 'Option 4' },
];

const SELECT_ITEMS = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3', disabled: true },
    { label: 'Option 4', value: '4' },
];

const CONTEXT_MENU_ITEMS = [
    { label: 'Edit', onClick: () => console.log('Edit clicked'), value: 'edit', icon: <PlusIcon size={16} /> },
    { label: 'Delete', onClick: () => console.log('Delete clicked'), value: 'delete', icon: <TrashIcon size={16} /> },
];

export default function ComponentsPage() {
    const [selectedRadio, setSelectedRadio] = useState('1');
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [sliderValue, setSliderValue] = useState([50]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [switchValue, setSwitchValue] = useState(false);
    const [checkboxValue, setCheckboxValue] = useState(false);

    const ComponentSection = ({
        title,
        children,
        description,
    }: {
        title: string;
        children: React.ReactNode;
        description?: string;
    }) => (
        <div className="!mb-12 !bg-white !rounded-xl !shadow-sm !border !border-gray-100 !overflow-hidden hover:!shadow-md !transition-shadow !duration-200">
            <div className="!bg-gradient-to-r !from-blue-50 !to-indigo-50 !px-8 !py-6 !border-b !border-gray-100">
                <div className="!flex !items-center !gap-3 !mb-2">
                    <div className="!w-2 !h-2 !bg-blue-500 !rounded-full"></div>
                    <h2 className="!text-2xl !font-bold !text-gray-900">{title}</h2>
                </div>
                {description && (
                    <div className="!flex !items-start !gap-2">
                        <InfoIcon className="!w-5 !h-5 !text-blue-500 !mt-0.5 !flex-shrink-0" />
                        <p className="!text-gray-600 !leading-relaxed">{description}</p>
                    </div>
                )}
            </div>
            <div className="!p-8">
                <div className="!space-y-6">{children}</div>
            </div>
        </div>
    );

    const CodeExample = ({ children }: { children: React.ReactNode }) => (
        <div className="!bg-gray-900 !rounded-lg !p-4 !overflow-x-auto">
            <div className="!flex !items-center !gap-2 !mb-3">
                <CodeIcon className="!w-4 !h-4 !text-gray-400" />
                <span className="!text-gray-400 !text-sm !font-medium">Code Example</span>
            </div>
            <pre className="!text-sm !font-mono !text-gray-100 !leading-relaxed !select-text">
                <code className="!select-text">{children}</code>
            </pre>
        </div>
    );

    const PropsTable = ({
        props,
    }: {
        props: Array<{ name: string; type: string; description: string; required?: boolean }>;
    }) => (
        <div className="!bg-gray-50 !rounded-lg !p-6">
            <h4 className="!font-semibold !text-gray-900 !mb-4 !flex !items-center !gap-2">
                <div className="!w-1.5 !h-1.5 !bg-gray-400 !rounded-full"></div>
                Props
            </h4>
            <div className="!overflow-x-auto">
                <table className="!w-full !text-sm">
                    <thead>
                        <tr className="!border-b !border-gray-200">
                            <th className="!text-left !py-2 !px-3 !font-semibold !text-gray-700">Prop</th>
                            <th className="!text-left !py-2 !px-3 !font-semibold !text-gray-700">Type</th>
                            <th className="!text-left !py-2 !px-3 !font-semibold !text-gray-700">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.map((prop, index) => (
                            <tr key={index} className="!border-b !border-gray-100 hover:!bg-gray-50">
                                <td className="!py-2 !px-3">
                                    <code className="!bg-blue-100 !text-blue-800 !px-2 !py-1 !rounded !text-xs !font-mono">
                                        {prop.name}
                                        {prop.required && <span className="!text-red-500 !ml-1">*</span>}
                                    </code>
                                </td>
                                <td className="!py-2 !px-3">
                                    <code className="!bg-gray-100 !text-gray-700 !px-2 !py-1 !rounded !text-xs !font-mono">
                                        {prop.type}
                                    </code>
                                </td>
                                <td className="!py-2 !px-3 !text-gray-600">{prop.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const DemoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="!bg-white !border !border-gray-200 !rounded-lg !p-6">
            <h5 className="!font-medium !text-gray-900 !mb-4 !flex !items-center !gap-2">
                <div className="!w-1 !h-1 !bg-gray-400 !rounded-full"></div>
                {title}
            </h5>
            <div className="!flex !flex-wrap !gap-4 !items-center">{children}</div>
        </div>
    );

    return (
        <div className="!min-h-screen !bg-gradient-to-br !from-gray-50 !to-blue-50">
            {/* Header */}
            <div className="!bg-white !border-b !border-gray-200">
                <div className="!max-w-7xl !mx-auto !px-6 !py-8">
                    <div className="!text-center">
                        <h1 className="!text-5xl !font-bold !bg-gradient-to-r !from-blue-600 !to-indigo-600 !bg-clip-text !text-transparent !mb-4">
                            UI Components Documentation
                        </h1>
                        <p className="!text-xl !text-gray-600 !max-w-3xl !mx-auto !leading-relaxed">
                            A comprehensive guide to our design system components with examples, props, and usage
                            patterns.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="!max-w-7xl !mx-auto !px-6 !py-12">
                {/* Avatar Component */}
                <ComponentSection
                    title="Avatar"
                    description="Display user avatars with fallback initials and lazy loading support. Perfect for user profiles and contact lists."
                >
                    <DemoSection title="Avatar Examples">
                        <S_Avatar
                            image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                            name="John Doe"
                            size="200"
                        />
                        <S_Avatar image="" name="Jane Smith" size="300" />
                        <S_Avatar
                            image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                            name="Bob Johnson"
                            size="400"
                        />
                    </DemoSection>

                    <PropsTable
                        props={[
                            { name: 'image', type: 'string', description: 'URL of the avatar image' },
                            { name: 'name', type: 'string', description: 'User name for fallback initials' },
                            {
                                name: 'size',
                                type: "'100' | '200' | '300' | '400' | '500' | '600' | '700' | '750' | '800' | '850' | '900'",
                                description: 'Avatar size in pixels',
                            },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Avatar 
    image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" 
    name="John Doe" 
    size="200" 
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Badge Component */}
                <ComponentSection
                    title="Badge"
                    description="Display status indicators with different variants and colors. Ideal for showing user status, notifications, or data states."
                >
                    <DemoSection title="Default Variant">
                        <S_Badge text="Default" status="default" variant="default" />
                        <S_Badge text="Success" status="success" variant="default" />
                        <S_Badge text="Error" status="error" variant="default" />
                        <S_Badge text="Warning" status="warning" variant="default" />
                        <S_Badge text="Processing" status="processing" variant="default" />
                    </DemoSection>

                    <DemoSection title="Primary Variant">
                        <S_Badge text="Primary Default" status="default" variant="primary" />
                        <S_Badge text="Primary Success" status="success" variant="primary" />
                        <S_Badge text="Primary Error" status="error" variant="primary" />
                    </DemoSection>

                    <PropsTable
                        props={[
                            { name: 'text', type: 'string', description: 'Badge text content', required: true },
                            {
                                name: 'status',
                                type: "'default' | 'success' | 'error' | 'processing' | 'warning'",
                                description: 'Status color theme',
                            },
                            { name: 'variant', type: "'default' | 'primary'", description: 'Visual variant style' },
                        ]}
                    />

                    <CodeExample>{`<S_Badge text="Success" status="success" variant="primary" />`}</CodeExample>
                </ComponentSection>

                {/* Button Component */}
                <ComponentSection
                    title="Button"
                    description="Versatile button component with multiple variants, colors, and states. Supports icons, loading states, and various interactions."
                >
                    <DemoSection title="Color Variants">
                        <S_Button variant="main-20" color="primary">
                            Primary Button
                        </S_Button>
                        <S_Button variant="main-20" color="secondary">
                            Secondary Button
                        </S_Button>
                        <S_Button variant="outlined-20" color="primary">
                            Outlined Button
                        </S_Button>
                        <S_Button variant="ghost-20" color="red">
                            Ghost Red
                        </S_Button>
                    </DemoSection>

                    <DemoSection title="States">
                        <S_Button disabled variant="main-20" color="primary">
                            Disabled Button
                        </S_Button>
                        <S_Button isIcon iconBtnSize="15" variant="main-20" color="secondary" aria-label="Add Item">
                            <PlusIcon size={16} />
                        </S_Button>
                    </DemoSection>

                    <PropsTable
                        props={[
                            {
                                name: 'variant',
                                type: "'main-10' | 'main-20' | 'main-30' | 'outlined-10' | 'outlined-20' | 'outlined-30' | 'ghost-10' | 'ghost-20' | 'ghost-30'",
                                description: 'Button style variant',
                            },
                            {
                                name: 'color',
                                type: "'primary' | 'secondary' | 'red' | 'green'",
                                description: 'Color scheme',
                            },
                            { name: 'disabled', type: 'boolean', description: 'Disable the button' },
                            { name: 'isIcon', type: 'boolean', description: 'Icon-only button mode' },
                            {
                                name: 'iconBtnSize',
                                type: "'0' | '5' | '10' | '15' | '20' | '30'",
                                description: 'Icon button size',
                            },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Button variant="main-20" color="primary">
    Primary Button
</S_Button>`}
                    </CodeExample>
                </ComponentSection>

                {/* Checkbox Component */}
                <ComponentSection
                    title="Checkbox"
                    description="Checkbox input with support for labels, different sizes, and indeterminate state. Perfect for forms and data selection."
                >
                    <DemoSection title="Checkbox States">
                        <S_Checkbox
                            label="Basic Checkbox"
                            color="primary"
                            size="200"
                            checked={checkboxValue}
                            onCheckedChange={(details: CheckedChangeDetails) =>
                                setCheckboxValue(details.checked === true)
                            }
                            indeterminate={false}
                        />
                        <S_Checkbox
                            label="Indeterminate Checkbox"
                            indeterminate={true}
                            color="primary"
                            size="300"
                            checked={checkboxValue}
                            onCheckedChange={(details: CheckedChangeDetails) =>
                                setCheckboxValue(details.checked === true)
                            }
                        />
                        <S_Checkbox label="Disabled Checkbox" disabled={true} color="primary-blue" size="200" />
                    </DemoSection>

                    <PropsTable
                        props={[
                            { name: 'label', type: 'string', description: 'Checkbox label text' },
                            { name: 'color', type: "'primary' | 'blue' | 'primary-blue'", description: 'Color theme' },
                            { name: 'size', type: "'100' | '200' | '300'", description: 'Checkbox size' },
                            { name: 'checked', type: 'boolean', description: 'Checkbox state' },
                            {
                                name: 'onCheckedChange',
                                type: '(details: CheckedChangeDetails) => void',
                                description: 'Change handler function',
                            },
                            { name: 'indeterminate', type: 'boolean', description: 'Indeterminate state' },
                            { name: 'disabled', type: 'boolean', description: 'Disable the checkbox' },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Checkbox 
    label="Basic Checkbox" 
    color="primary" 
    size="200" 
    checked={value}
    onCheckedChange={(details) => setValue(details.checked === true)}
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Context Menu Component */}
                <ComponentSection
                    title="Context Menu"
                    description="Right-click context menu with customizable items and positioning. Great for contextual actions and quick access menus."
                >
                    <DemoSection title="Context Menu Trigger">
                        <S_ContextMenu2
                            triggerBox={
                                <div className="!p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 text-center">
                                    <div className="text-gray-600 font-medium">Right-click me for context menu</div>
                                    <div className="text-sm text-gray-400 !mt-1">Try right-clicking on this area</div>
                                </div>
                            }
                        >
                            {CONTEXT_MENU_ITEMS.map((item) => (
                                <div
                                    key={item.value}
                                    className="!px-4 !py-2 hover:bg-gray-100 cursor-pointer flex items-center !gap-2 transition-colors duration-150"
                                    onClick={item.onClick}
                                >
                                    {item.icon}
                                    {item.label}
                                </div>
                            ))}
                        </S_ContextMenu2>
                    </DemoSection>

                    <PropsTable
                        props={[
                            {
                                name: 'triggerBox',
                                type: 'ReactNode',
                                description: 'Element that triggers the menu',
                                required: true,
                            },
                            { name: 'trigger', type: "'click' | 'contextmenu'", description: 'Trigger type' },
                            {
                                name: 'menuPosition',
                                type: "'left' | 'right' | 'top' | 'bottom'",
                                description: 'Menu position relative to trigger',
                            },
                            {
                                name: 'controlled',
                                type: 'boolean',
                                description: 'Controlled mode for manual state management',
                            },
                        ]}
                    />

                    <CodeExample>
                        {`<S_ContextMenu2
    triggerBox={<div>Right-click me</div>}
    trigger="contextmenu"
>
    <div onClick={() => console.log('Edit')}>Edit</div>
    <div onClick={() => console.log('Delete')}>Delete</div>
</S_ContextMenu2>`}
                    </CodeExample>
                </ComponentSection>

                {/* Drawer Component */}
                <ComponentSection
                    title="Drawer"
                    description="Slide-out drawer panel with multiple positions and customizable width. Perfect for side navigation, forms, or detailed content."
                >
                    <DemoSection title="Drawer Trigger">
                        <S_Button onClick={() => setIsDrawerOpen(true)} variant="outlined-20" color="primary">
                            Open Left Drawer
                        </S_Button>
                    </DemoSection>

                    <S_Drawer
                        isOpen={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                        position="left"
                        width="400px"
                    >
                        <div className="!p-6">
                            <h3 className="!text-lg font-semibold !mb-4 text-gray-900">Drawer Content</h3>
                            <p className="text-gray-600 !mb-6">
                                This is the drawer content. You can put any content here including forms, navigation, or
                                detailed information.
                            </p>
                            <div className="!space-y-3">
                                <div className="!p-3 bg-gray-50 rounded-lg">
                                    <div className="font-medium text-gray-900">Sample Item 1</div>
                                    <div className="text-sm text-gray-600">Description for item 1</div>
                                </div>
                                <div className="!p-3 bg-gray-50 rounded-lg">
                                    <div className="font-medium text-gray-900">Sample Item 2</div>
                                    <div className="text-sm text-gray-600">Description for item 2</div>
                                </div>
                            </div>
                            <S_Button onClick={() => setIsDrawerOpen(false)} className="!mt-6 w-full">
                                Close Drawer
                            </S_Button>
                        </div>
                    </S_Drawer>

                    <PropsTable
                        props={[
                            {
                                name: 'isOpen',
                                type: 'boolean',
                                description: 'Control drawer visibility',
                                required: true,
                            },
                            {
                                name: 'onClose',
                                type: '() => void',
                                description: 'Close handler function',
                                required: true,
                            },
                            {
                                name: 'position',
                                type: "'left' | 'right' | 'top' | 'bottom'",
                                description: 'Drawer position',
                            },
                            {
                                name: 'width',
                                type: 'string | number',
                                description: 'Drawer width (for left/right) or height (for top/bottom)',
                            },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Drawer 
    isOpen={isOpen} 
    onClose={() => setIsOpen(false)}
    position="left"
    width="400px"
>
    <div>Drawer content</div>
</S_Drawer>`}
                    </CodeExample>
                </ComponentSection>

                {/* Image Component */}
                <ComponentSection
                    title="Image"
                    description="Lazy-loading image component with placeholder and effects support. Optimized for performance with progressive loading."
                >
                    <DemoSection title="Image Examples">
                        <div className="flex gap-6">
                            <div className="text-center">
                                <S_Image
                                    src="https://images.unsplash.com/photo-1579353977828-2a4eab540b9a"
                                    onTransitionEnd={() => console.log('Image loaded')}
                                    alt="Sample image"
                                    width={200}
                                    height={150}
                                    effect="blur"
                                />
                                <div className="text-sm text-gray-600 mt-2">Blur Effect</div>
                            </div>
                            <div className="text-center">
                                <S_Image
                                    src="https://images.unsplash.com/photo-1579353977828-2a4eab540b9a"
                                    alt="Another image"
                                    width={200}
                                    height={150}
                                    effect="black-and-white"
                                />
                                <div className="text-sm text-gray-600 mt-2">Opacity Effect</div>
                            </div>
                        </div>
                    </DemoSection>

                    <PropsTable
                        props={[
                            { name: 'src', type: 'string', description: 'Image source URL', required: true },
                            { name: 'alt', type: 'string', description: 'Alt text for accessibility', required: true },
                            { name: 'width', type: 'number', description: 'Image width in pixels' },
                            { name: 'height', type: 'number', description: 'Image height in pixels' },
                            {
                                name: 'effect',
                                type: "'blur' | 'opacity' | 'black-and-white'",
                                description: 'Loading effect type',
                            },
                            { name: 'placeholderSrc', type: 'string', description: 'Placeholder image URL' },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Image 
    src="https://example.com/image.jpg" 
    alt="Description"
    width={200}
    height={150}
    effect="blur"
    placeholderSrc="https://example.com/placeholder.jpg"
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Input Component */}
                <ComponentSection
                    title="Input"
                    description="Form input field with label, description, error handling, and different sizes. Supports icons and various input types."
                >
                    <div className="!space-y-6 !max-w-md">
                        <DemoSection title="Basic Inputs">
                            <S_Input
                                label="Basic Input"
                                placeholder="Enter text here"
                                description="This is a helper text"
                            />

                            <S_Input
                                label="Input with Error"
                                placeholder="Enter text here"
                                errorText="This field is required"
                            />
                        </DemoSection>

                        <DemoSection title="Input Sizes">
                            <S_Input label="Small Input" placeholder="Small input" inputSize="small" />

                            <S_Input label="Default Input" placeholder="Default input" inputSize="default" />
                        </DemoSection>

                        <DemoSection title="Input with Icon">
                            <S_Input
                                label="Input with Icon"
                                placeholder="Search..."
                                inputSize="default"
                                icon={<SearchIcon />}
                                iconPosition="right"
                            />
                        </DemoSection>

                        <DemoSection title="Input types">
                            <S_Input label="Text Input" placeholder="Enter text" inputSize="default" />

                            <S_Input
                                label="Number Input"
                                placeholder="Enter number"
                                inputSize="default"
                                type="number"
                            />
                        </DemoSection>
                    </div>

                    <PropsTable
                        props={[
                            { name: 'label', type: 'string', description: 'Input label text' },
                            { name: 'description', type: 'string', description: 'Helper text below input' },
                            { name: 'errorText', type: 'string', description: 'Error message text' },
                            {
                                name: 'inputSize',
                                type: "'default' | 'medium' | 'small'",
                                description: 'Input field size',
                            },
                            { name: 'icon', type: 'ReactNode', description: 'Icon element to display' },
                            {
                                name: 'iconPosition',
                                type: "'left' | 'right'",
                                description: 'Icon position relative to input',
                            },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Input 
    label="Username"
    placeholder="Enter username"
    description="Must be unique"
    errorText="Username is required"
    inputSize="medium"
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Input Password Component */}
                {/* <ComponentSection
                    title="Input Password"
                    description="Password input field with show/hide toggle functionality. Includes built-in security features and accessibility support."
                >
                    <DemoSection title="Password Input">
                        <S_InputPassword label="Password" placeholder="Enter password" />
                    </DemoSection>

                    <PropsTable
                        props={[
                            { name: 'label', type: 'string', description: 'Input label text' },
                            { name: 'description', type: 'string', description: 'Helper text below input' },
                            { name: 'errorText', type: 'string', description: 'Error message text' },
                            {
                                name: 'inputSize',
                                type: "'default' | 'medium' | 'small'",
                                description: 'Input field size',
                            },
                        ]}
                    />

                    <CodeExample>
                        {`<S_InputPassword 
    label="Password"
    placeholder="Enter password"
    description="Must be at least 8 characters"
    inputSize="medium"
/>`}
                    </CodeExample>
                </ComponentSection> */}

                {/* Input with Icon Component */}
                {/* <ComponentSection
                    title="Input with Icon"
                    description="Input field with integrated icon and click handler support. Perfect for search inputs and interactive form fields."
                >
                    <div className="space-y-6 max-w-md">
                        <DemoSection title="Icon Inputs">
                            <S_InputWithIcon
                                label="Search Input"
                                placeholder="Search..."
                                icon={<SearchIcon size={16} />}
                                onClickIcon={() => console.log('Search clicked')}
                            />

                            <S_InputWithIcon
                                label="Input with Right Icon"
                                placeholder="Enter text"
                                icon={<PlusIcon size={16} />}
                                onClickIcon={() => console.log('Icon clicked')}
                            />
                        </DemoSection>
                    </div>

                    <PropsTable
                        props={[
                            { name: 'label', type: 'string', description: 'Input label text' },
                            { name: 'icon', type: 'ReactNode', description: 'Icon element to display', required: true },
                            { name: 'onClickIcon', type: '() => void', description: 'Icon click handler function' },
                            {
                                name: 'inputSize',
                                type: "'default' | 'medium' | 'small'",
                                description: 'Input field size',
                            },
                        ]}
                    />

                    <CodeExample>
                        {`<S_InputWithIcon 
    label="Search"
    placeholder="Search..."
    icon={<SearchIcon size={16} />}
    onClickIcon={() => console.log('Search clicked')}
/>`}
                    </CodeExample>
                </ComponentSection> */}

                {/* Pagination Component */}
                <ComponentSection
                    title="Pagination"
                    description="Pagination component with customizable page size and navigation. Supports large datasets with efficient page switching."
                >
                    <DemoSection title="Pagination Examples">
                        <S_Pagination
                            totalCount={100}
                            take={10}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            showPageNumbers={true}
                        />
                    </DemoSection>

                    <PropsTable
                        props={[
                            {
                                name: 'totalCount',
                                type: 'number',
                                description: 'Total number of items',
                                required: true,
                            },
                            { name: 'take', type: 'number', description: 'Items per page' },
                            { name: 'currentPage', type: 'number', description: 'Current page number', required: true },
                            {
                                name: 'setCurrentPage',
                                type: '(page: number) => void',
                                description: 'Page change handler function',
                                required: true,
                            },
                            { name: 'showPageNumbers', type: 'boolean', description: 'Show page number buttons' },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Pagination 
    totalCount={100}
    take={10}
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    showPageNumbers={true}
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Radio Group Component */}
                <ComponentSection
                    title="Radio Group"
                    description="Radio button group with support for different variants and colors. Ideal for single-choice selections in forms."
                >
                    <DemoSection title="Radio Groups">
                        <S_RadioGroup
                            label="Select an option"
                            groupData={RADIO_ITEMS}
                            value={selectedRadio}
                            onValueChange={(details) => setSelectedRadio(details.value)}
                            color="primary"
                            variant="default"
                        />
                    </DemoSection>

                    <DemoSection title="Primary Variant">
                        <S_RadioGroup
                            label="Primary variant"
                            groupData={RADIO_ITEMS}
                            color="secondary"
                            variant="primary"
                        />
                    </DemoSection>

                    <PropsTable
                        props={[
                            { name: 'label', type: 'string', description: 'Group label text' },
                            { name: 'groupData', type: 'Array', description: 'Radio options array', required: true },
                            { name: 'value', type: 'string | number', description: 'Selected value' },
                            {
                                name: 'onValueChange',
                                type: '(details: ValueChangeDetails) => void',
                                description: 'Change handler function',
                            },
                            { name: 'color', type: "'primary' | 'secondary'", description: 'Color theme' },
                            { name: 'variant', type: "'default' | 'primary'", description: 'Visual variant' },
                        ]}
                    />

                    <CodeExample>
                        {`<S_RadioGroup 
    label="Select an option"
    groupData={[
        { id: 1, label: 'Option 1' },
        { id: 2, label: 'Option 2' }
    ]}
    value={selectedValue}
    onValueChange={(details) => setSelectedValue(details.value)}
    color="primary"
    variant="default"
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Select Component */}
                <ComponentSection
                    title="Select"
                    description="Dropdown select component with single/multiple selection and search functionality. Supports async data loading and custom filtering."
                >
                    <div className="!space-y-6 max-w-md">
                        <DemoSection title="Single Select">
                            <S_Select_Simple
                                label="Single Select"
                                items={SELECT_ITEMS}
                                value={selectedItems}
                                setSelectedItems={(items) => setSelectedItems(items)}
                                placeholder="Select an option"
                            />
                        </DemoSection>

                        <DemoSection title="Select with Search">
                            <S_Select_Simple
                                label="Searchable Select"
                                items={SELECT_ITEMS}
                                value={selectedItems}
                                setSelectedItems={(items) => setSelectedItems(items)}
                                placeholder="Select multiple options"
                                showSearch
                            />
                        </DemoSection>
                    </div>

                    <PropsTable
                        props={[
                            { name: 'label', type: 'string', description: 'Select label text' },
                            { name: 'items', type: 'Array', description: 'Select options array', required: true },
                            { name: 'multiple', type: 'boolean', description: 'Enable multi-selection mode' },
                            { name: 'variant', type: "'default' | 'checkbox'", description: 'Selection variant style' },
                            {
                                name: 'onChange',
                                type: '(items: any[]) => void',
                                description: 'Change handler function',
                            },
                            {
                                name: 'loadingStatus',
                                type: "'pending' | 'success' | 'error'",
                                description: 'Loading state indicator',
                            },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Select 
    label="Choose Options"
    items={[
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' }
    ]}
    multiple
    variant="checkbox"
    onChange={(items) => console.log(items)}
    placeholder="Select options"
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Side Panel Component */}
                <ComponentSection
                    title="Side Panel"
                    description="Slide-out side panel with overlay and customizable content. Great for detailed views, forms, or supplementary information."
                >
                    <DemoSection title="Side Panel Trigger">
                        <S_Button onClick={() => setIsSidePanelOpen(true)} variant="outlined-20" color="primary">
                            Open Side Panel
                        </S_Button>
                    </DemoSection>

                    <S_SidePanel open={isSidePanelOpen} onOpenChange={setIsSidePanelOpen} title="Side Panel">
                        <div className="!p-6">
                            <h3 className="text-lg font-semibold !mb-4 text-gray-900">Side Panel Content</h3>
                            <p className="text-gray-600 !mb-6">
                                This is the side panel content. You can put any content here including forms,
                                navigation, or detailed information.
                            </p>
                            <div className="!space-y-4">
                                <div className="!p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="font-medium text-blue-900">Information Panel</div>
                                    <div className="text-sm text-blue-700 !mt-1">
                                        This is an example of structured content in the side panel.
                                    </div>
                                </div>
                                <div className="!p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="font-medium text-green-900">Success Panel</div>
                                    <div className="text-sm text-green-700 !mt-1">
                                        Another example with different styling.
                                    </div>
                                </div>
                            </div>
                            <S_Button
                                onClick={() => setIsSidePanelOpen(false)}
                                className="!mt-6 w-full"
                                variant="outlined-20"
                                color="primary"
                            >
                                Close Panel
                            </S_Button>
                        </div>
                    </S_SidePanel>

                    <PropsTable
                        props={[
                            { name: 'open', type: 'boolean', description: 'Control panel visibility', required: true },
                            {
                                name: 'onOpenChange',
                                type: '(open: boolean) => void',
                                description: 'Visibility change handler',
                                required: true,
                            },
                            { name: 'title', type: 'string', description: 'Panel title text', required: true },
                            { name: 'children', type: 'ReactNode', description: 'Panel content', required: true },
                        ]}
                    />

                    <CodeExample>
                        {`<S_SidePanel 
    open={isOpen}
    onOpenChange={setIsOpen}
    title="Side Panel"
>
    <div>Panel content</div>
</S_SidePanel>`}
                    </CodeExample>
                </ComponentSection>

                {/* Slider Component */}
                <ComponentSection
                    title="Slider"
                    description="Range slider with customizable min/max values, steps, and visual feedback. Perfect for numeric input with visual representation."
                >
                    <div className="space-y-8 max-w-md">
                        <DemoSection title="Basic Slider">
                            <S_Slider
                                min={0}
                                max={100}
                                step={1}
                                value={sliderValue}
                                onChange={setSliderValue}
                                showValue={true}
                                label="Value"
                            />
                        </DemoSection>

                        <DemoSection title="Colored Slider">
                            <S_Slider
                                min={0}
                                max={100}
                                step={5}
                                color="red"
                                size="30"
                                showValue={true}
                                valuePrefix="$"
                                label="Price Range"
                            />
                        </DemoSection>
                    </div>

                    <PropsTable
                        props={[
                            { name: 'min', type: 'number', description: 'Minimum value', required: true },
                            { name: 'max', type: 'number', description: 'Maximum value', required: true },
                            { name: 'step', type: 'number', description: 'Step increment value' },
                            { name: 'value', type: 'number[]', description: 'Current value(s)', required: true },
                            {
                                name: 'onChange',
                                type: '(value: number[]) => void',
                                description: 'Change handler function',
                            },
                            {
                                name: 'color',
                                type: "'primary' | 'secondary' | 'red' | 'green'",
                                description: 'Slider color theme',
                            },
                            { name: 'size', type: "'10' | '15' | '20' | '30'", description: 'Slider size' },
                            { name: 'showValue', type: 'boolean', description: 'Show current value display' },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Slider 
    min={0}
    max={100}
    step={1}
    value={value}
    onChange={setValue}
    color="primary"
    size="20"
    showValue={true}
    label="Range"
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Switch Component */}
                <ComponentSection
                    title="Switch"
                    description="Toggle switch component with different colors and variants. Ideal for enabling/disabling features or settings."
                >
                    <DemoSection title="Switch Variants">
                        <S_Switch
                            label="Default Switch"
                            color="blue"
                            variant="default"
                            checked={switchValue}
                            onCheckedChange={({ checked }) => setSwitchValue(checked === true)}
                        />

                        <S_Switch label="Primary Switch" color="primary" variant="primary" />

                        <S_Switch label="Disabled Switch" disabled={true} />
                    </DemoSection>

                    <PropsTable
                        props={[
                            { name: 'label', type: 'string', description: 'Switch label text' },
                            { name: 'color', type: "'primary' | 'blue'", description: 'Switch color theme' },
                            { name: 'variant', type: "'default' | 'primary'", description: 'Visual variant style' },
                            { name: 'checked', type: 'boolean', description: 'Switch state' },
                            {
                                name: 'onCheckedChange',
                                type: '(details: { checked: boolean }) => void',
                                description: 'Change handler function',
                            },
                            { name: 'disabled', type: 'boolean', description: 'Disable the switch' },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Switch 
    label="Enable notifications"
    color="primary"
    variant="default"
    checked={value}
    onCheckedChange={({ checked }) => setValue(checked === true)}
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Textarea Component */}
                <ComponentSection
                    title="Textarea"
                    description="Multi-line text input with customizable size and resize options. Perfect for longer text content like descriptions or comments."
                >
                    <div className="space-y-6 max-w-md">
                        <DemoSection title="Basic Textarea">
                            <S_Textarea
                                label="Basic Textarea"
                                placeholder="Enter your text here..."
                                description="This is a helper text"
                                rows={4}
                            />
                        </DemoSection>

                        <DemoSection title="Resizable Textarea">
                            <S_Textarea
                                label="Resizable Textarea"
                                placeholder="This textarea can be resized"
                                resize="both"
                                rows={3}
                            />
                        </DemoSection>

                        <DemoSection title="Small Textarea">
                            <S_Textarea
                                label="Small Textarea"
                                placeholder="Small textarea"
                                textareaSize="small"
                                rows={2}
                            />
                        </DemoSection>
                    </div>

                    <PropsTable
                        props={[
                            { name: 'label', type: 'string', description: 'Textarea label text' },
                            { name: 'description', type: 'string', description: 'Helper text below textarea' },
                            { name: 'errorText', type: 'string', description: 'Error message text' },
                            {
                                name: 'textareaSize',
                                type: "'default' | 'medium' | 'small'",
                                description: 'Textarea size',
                            },
                            { name: 'rows', type: 'number', description: 'Number of visible rows' },
                            {
                                name: 'resize',
                                type: "'both' | 'horizontal' | 'vertical' | 'none'",
                                description: 'Resize behavior',
                            },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Textarea 
    label="Description"
    placeholder="Enter description..."
    description="Provide a detailed description"
    rows={4}
    resize="vertical"
    textareaSize="medium"
/>`}
                    </CodeExample>
                </ComponentSection>

                {/* Tooltip Component */}
                <ComponentSection
                    title="Tooltip"
                    description="Hover tooltip component with customizable positioning and content. Great for providing additional context or help text."
                >
                    <DemoSection title="Tooltip Positions">
                        <div className="flex flex-wrap gap-4 items-center justify-center">
                            <S_Tooltip content="This is a tooltip on top" position="top">
                                <S_Button variant="outlined-20">Hover me (Top)</S_Button>
                            </S_Tooltip>

                            <S_Tooltip content="This is a tooltip on bottom" position="bottom">
                                <S_Button variant="outlined-20">Hover me (Bottom)</S_Button>
                            </S_Tooltip>

                            <S_Tooltip content="This is a tooltip on left" position="left">
                                <S_Button variant="outlined-20">Hover me (Left)</S_Button>
                            </S_Tooltip>

                            <S_Tooltip content="This is a tooltip on right" position="right">
                                <S_Button variant="outlined-20">Hover me (Right)</S_Button>
                            </S_Tooltip>
                        </div>
                    </DemoSection>

                    <PropsTable
                        props={[
                            { name: 'content', type: 'ReactNode', description: 'Tooltip content', required: true },
                            {
                                name: 'position',
                                type: 'Placement',
                                description: 'Tooltip position relative to trigger',
                            },
                            { name: 'offset', type: 'ITooltipAxis', description: 'Offset from trigger element' },
                            { name: 'openDelay', type: 'number', description: 'Delay before showing tooltip (ms)' },
                            { name: 'closeDelay', type: 'number', description: 'Delay before hiding tooltip (ms)' },
                        ]}
                    />

                    <CodeExample>
                        {`<S_Tooltip 
    content="This is a helpful tooltip"
    position="top"
    openDelay={300}
    closeDelay={300}
>
    <S_Button>Hover me</S_Button>
</S_Tooltip>`}
                    </CodeExample>
                </ComponentSection>
            </div>
        </div>
    );
}
