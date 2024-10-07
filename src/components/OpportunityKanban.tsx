import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { mockApi } from '../mockApi';
import { Trash2, ArrowRight } from 'lucide-react';
import { useTheme } from './theme-provider';

interface Opportunity {
  key: string;
  company: string;
  title: string;
  status: string;
  blurb: string;
  suburb: string;
  state: string;
  technologies: string[];
}

const DraggableOpportunityCard: React.FC<{
  opportunity: Opportunity;
  index: number;
  moveOpportunity: (dragIndex: number, hoverIndex: number) => void;
}> = ({ opportunity, index, moveOpportunity }) => {
  const { theme } = useTheme();
  const [{ isDragging }, drag] = useDrag({
    type: 'OPPORTUNITY',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'OPPORTUNITY',
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveOpportunity(item.index, index);
        item.index = index;
      }
    },
  });

  const cardStyle = {
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: theme === 'dark' ? '#333333' : '#FFFFFF',
    color: theme === 'dark' ? '#FFFFFF' : '#000000',
    border: '1px solid #ccc',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'move',
  };

  return (
    <div ref={(node) => drag(drop(node))} style={cardStyle}>
      <h3>{opportunity.title}</h3>
      <p>{opportunity.company}</p>
      <p>{opportunity.blurb}</p>
      <p>{`${opportunity.suburb}, ${opportunity.state}`}</p>
      <div>
        {opportunity.technologies.map((tech, index) => (
          <span key={index} className="mr-2 px-2 py-1 bg-gray-200 rounded-full text-sm">
            {tech}
          </span>
        ))}
      </div>
      <div className="flex justify-end mt-2">
        <button className="mr-2">
          <Trash2 className={`h-5 w-5 ${theme === 'dark' ? 'text-white hover:text-accent' : 'text-black hover:text-accent'}`} />
        </button>
        <button>
          <ArrowRight className={`h-5 w-5 ${theme === 'dark' ? 'text-white hover:text-accent' : 'text-black hover:text-accent'}`} />
        </button>
      </div>
    </div>
  );
};

const OpportunityKanban: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await mockApi.getOpportunities();
        setOpportunities(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const moveOpportunity = useCallback((dragIndex: number, hoverIndex: number) => {
    setOpportunities((prevOpportunities) => {
      const updatedOpportunities = [...prevOpportunities];
      const [reorderedItem] = updatedOpportunities.splice(dragIndex, 1);
      updatedOpportunities.splice(hoverIndex, 0, reorderedItem);
      return updatedOpportunities;
    });
  }, []);

  const columns = useMemo(() => [
    { title: 'New', status: 'new' },
    { title: 'Progressed', status: 'progressed' },
    { title: 'Contacts Added', status: 'contacts_added' },
    { title: 'Qualified', status: 'qualified' },
    { title: 'Contacted', status: 'contacted' },
    { title: 'Followed Up', status: 'followed_up' },
    { title: 'Replied', status: 'replied' },
  ], []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex overflow-x-auto p-4">
        {columns.map((column) => (
          <div
            key={column.status}
            className="flex-shrink-0 w-64 mr-4"
            style={{
              backgroundColor: theme === 'dark' ? '#666666' : '#F3F4F6',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <h2 className="text-lg font-bold mb-4">{column.title}</h2>
            {opportunities
              .filter((opp) => opp.status === column.status)
              .map((opportunity, index) => (
                <DraggableOpportunityCard
                  key={opportunity.key}
                  opportunity={opportunity}
                  index={index}
                  moveOpportunity={moveOpportunity}
                />
              ))}
          </div>
        ))}
      </div>
    </DndProvider>
  );
};

export default OpportunityKanban;