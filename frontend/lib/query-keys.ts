export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  properties: {
    all: ['properties'] as const,
    list: (query: string) => ['properties', 'list', query] as const,
    detail: (slug: string) => ['properties', 'detail', slug] as const,
    mine: ['properties', 'mine'] as const,
    mineList: (query: string) => ['properties', 'mine', query] as const,
    mineDetail: (id: string) => ['properties', 'mine', id] as const,
    amenities: ['properties', 'amenities'] as const,
  },
  agents: {
    all: ['agents'] as const,
    list: (query: string) => ['agents', 'list', query] as const,
    detail: (id: string) => ['agents', 'detail', id] as const,
    properties: (id: string) => ['agents', id, 'properties'] as const,
  },
  favorites: {
    all: ['favorites'] as const,
    list: (query: string) => ['favorites', 'list', query] as const,
    check: (propertyId: string) => ['favorites', 'check', propertyId] as const,
  },
  inquiries: {
    my: ['inquiries', 'my'] as const,
    myList: (query: string) => ['inquiries', 'my', query] as const,
    agent: ['inquiries', 'agent'] as const,
    agentList: (query: string) => ['inquiries', 'agent', query] as const,
  },
  visits: {
    my: ['visits', 'my'] as const,
    myList: (query: string) => ['visits', 'my', query] as const,
    agent: ['visits', 'agent'] as const,
    agentList: (query: string) => ['visits', 'agent', query] as const,
  },
  dashboard: {
    buyer: ['dashboard', 'buyer'] as const,
  },
  admin: {
    all: ['admin'] as const,
    stats: ['admin', 'stats'] as const,
    users: (query: string) => ['admin', 'users', query] as const,
    properties: (query: string) => ['admin', 'properties', query] as const,
  },
};
