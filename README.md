# JSON Merger

A professional web application for merging multiple JSON files with intelligent structure validation and flexible compatibility checking.

![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4)

## Features

### 🚀 **Advanced JSON Processing**
- **Flexible Structure Validation**: Merge JSON files with different optional properties
- **Smart Null Handling**: Automatically handles null vs actual values across files
- **Dual Validation System**: Strict and compatible structure checking
- **Intelligent Deep Merge**: Arrays concatenate, objects merge recursively

### 💼 **Professional User Experience**
- **Drag & Drop Upload**: Modern file upload with react-dropzone
- **Real-time Validation**: Instant feedback on file compatibility
- **Syntax Highlighted Viewer**: Professional JSON display with copy functionality
- **Progress Indicators**: Loading states and merge statistics
- **Dark Minimalist Theme**: Professional UI with high contrast

### 🔧 **Production Ready**
- **Comprehensive Error Handling**: Detailed error messages with resolution guidance
- **File Management**: Individual file removal and validation status
- **Download Management**: Progress states and file size calculation
- **Responsive Design**: Optimized for desktop and mobile

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/fiqto/mjson.git
cd mjson

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002) to access the application.

## Usage

### Basic Workflow

1. **Upload JSON Files**: Drag and drop or click to upload multiple `.json` files
2. **Structure Validation**: The app automatically validates file compatibility
3. **View Results**: Review the merged JSON with syntax highlighting
4. **Download**: Export the merged result as a new JSON file

### Supported JSON Structures

✅ **Compatible Files:**
```json
// File 1: user-data.json
[
  {"id": 1, "name": "John", "email": "john@example.com", "avatar": null},
  {"id": 2, "name": "Jane", "email": "jane@example.com", "avatar": "avatar.jpg"}
]

// File 2: more-users.json  
[
  {"id": 3, "name": "Bob", "email": "bob@example.com", "avatar": null, "role": "admin"},
  {"id": 4, "name": "Alice", "email": "alice@example.com", "avatar": "alice.jpg", "role": "user"}
]
```

**Result**: Successfully merges into single array with 4 users, handling optional `role` property and null `avatar` values.

### Advanced Features

#### **Flexible Property Handling**
- Files can have different optional properties
- Null values are compatible with any data type
- Missing properties don't break compatibility

#### **Smart Merge Strategies**
- **Arrays**: Concatenated in upload order
- **Objects**: Deep recursive merge
- **Primitives**: Last value wins
- **Null handling**: Graceful null vs value compatibility

## Technology Stack

- **Framework**: Next.js 15.4.1 with App Router
- **Runtime**: React 19.1.0 with concurrent features
- **Language**: TypeScript 5 with strict configuration
- **Styling**: Tailwind CSS 4 with custom dark theme
- **File Upload**: react-dropzone for drag-and-drop functionality
- **Icons**: Lucide React for professional iconography
- **Package Manager**: pnpm for optimal performance

## Development

### Available Scripts

```bash
pnpm dev      # Start development server (port 3002)
pnpm build    # Create production build
pnpm start    # Start production server
pnpm lint     # Run ESLint validation
```

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with dark theme
│   ├── layout.tsx         # Root layout with fonts
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── JsonUploader.tsx   # Drag-and-drop file upload
│   ├── JsonMerger.tsx     # Structure validation & merge
│   ├── JsonViewer.tsx     # Syntax-highlighted JSON display
│   └── DownloadButton.tsx # File export functionality
├── lib/                   # Utility functions
│   └── json-utils.ts      # Core JSON processing logic
└── types/                 # TypeScript definitions
    └── json.ts            # Application type definitions
```

### Key Technical Innovations

#### **Dual Structure Validation**
```typescript
// Strict validation for identical structures
generateStructureHash(obj)

// Flexible validation for compatible structures  
generateCompatibleStructureHash(obj)
```

#### **Smart Compatibility Checking**
- Handles files with different optional properties
- Treats null and actual values as compatible
- Enables merging of real-world JSON data with varying schemas

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue on the [GitHub repository](https://github.com/fiqto/mjson/issues).

---

Built with ❤️ using Next.js 15, React 19, and TypeScript