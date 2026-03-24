// Shared group tree shown for all accounts.
// Shape: { id, name, children: [...] }
export const mockGroups = [
  {
    id: 'g1', name: 'Engineering', children: [
      { id: 'g1a', name: 'Backend', children: [
        { id: 'g1a1', name: 'API Services',  children: [] },
        { id: 'g1a2', name: 'Data Platform', children: [] },
      ]},
      { id: 'g1b', name: 'Frontend', children: [
        { id: 'g1b1', name: 'Web App',    children: [] },
        { id: 'g1b2', name: 'Mobile SDK', children: [] },
      ]},
      { id: 'g1c', name: 'DevOps', children: [] },
    ],
  },
  {
    id: 'g2', name: 'Sales', children: [
      { id: 'g2a', name: 'North America', children: [
        { id: 'g2a1', name: 'Enterprise', children: [] },
        { id: 'g2a2', name: 'SMB',        children: [] },
      ]},
      { id: 'g2b', name: 'EMEA', children: [
        { id: 'g2b1', name: 'UK & Ireland', children: [] },
        { id: 'g2b2', name: 'DACH',         children: [] },
      ]},
    ],
  },
  {
    id: 'g3', name: 'Support', children: [
      { id: 'g3a', name: 'Tier 1',      children: [] },
      { id: 'g3b', name: 'Tier 2',      children: [] },
      { id: 'g3c', name: 'Escalations', children: [] },
    ],
  },
]
