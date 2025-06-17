# Quick Start Guide for Developers

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git
- Supabase account

## Initial Setup

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/tax-service-app.git
cd tax-service-app
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start Development Server**
```bash
npm start
```

## Project Structure

```
tax-service-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── store/         # Redux store and slices
│   ├── types/         # TypeScript type definitions
│   ├── lib/           # Utility functions and configurations
│   └── App.tsx        # Main application component
├── public/            # Static assets
└── docs/             # Documentation
```

## Key Features Implementation

### Authentication
```typescript
// Example of using Supabase auth
import { supabase } from '../lib/supabase';

const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};
```

### Service Requests
```typescript
// Example of creating a service request
const createRequest = async (requestData: ServiceRequest) => {
  const { data, error } = await supabase
    .from('service_requests')
    .insert([requestData]);
  return { data, error };
};
```

### Real-time Messaging
```typescript
// Example of subscribing to messages
const subscribeToMessages = (requestId: string) => {
  return supabase
    .from(`messages:request_id=eq.${requestId}`)
    .on('INSERT', handleNewMessage)
    .subscribe();
};
```

## Common Development Tasks

### Adding a New Component
1. Create component file in `src/components/`
2. Export component
3. Import and use in pages

### Adding a New Page
1. Create page file in `src/pages/`
2. Add route in `App.tsx`
3. Update navigation if needed

### Adding Redux State
1. Create new slice in `src/store/slices/`
2. Add to store configuration
3. Use in components with `useSelector` and `useDispatch`

## Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

## Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Deployment

1. **Build the Application**
```bash
npm run build
```

2. **Deploy to Your Hosting Platform**
- Vercel
- Netlify
- AWS
- etc.

## Troubleshooting

### Common Issues

1. **Build Errors**
- Clear `node_modules` and reinstall
- Check TypeScript errors
- Verify environment variables

2. **Runtime Errors**
- Check browser console
- Verify API endpoints
- Check authentication state

3. **Performance Issues**
- Use React DevTools
- Check bundle size
- Optimize images

## Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Submit pull request

## Resources

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Material-UI Documentation](https://mui.com/)
- [Supabase Documentation](https://supabase.io/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/) 