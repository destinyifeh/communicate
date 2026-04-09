import { Badge } from '@/components/ui/badge';
import { BusinessCategoryType, PlanType, businessCategories, planDetails } from '@/lib/businessTypes';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface BusinessCategorySelectorProps {
  selectedCategory: BusinessCategoryType | null;
  onSelect: (category: BusinessCategoryType) => void;
  currentPlan: PlanType;
  availableCategories?: BusinessCategoryType[];
}

export function BusinessCategorySelector({ 
  selectedCategory, 
  onSelect,
  currentPlan,
  availableCategories
}: BusinessCategorySelectorProps) {
  const plan = planDetails[currentPlan];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {businessCategories
        .filter(category => !availableCategories || availableCategories.includes(category.id))
        .map((category, index) => {
        const isSupported = plan.supportedCategories.includes(category.id);
        const isSelected = selectedCategory === category.id;
        
        return (
          <motion.button
            key={category.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => isSupported && onSelect(category.id)}
            disabled={!isSupported}
            className={`relative p-6 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                : isSupported
                ? 'border-border hover:border-primary/50 hover:shadow-md'
                : 'border-border/50 opacity-60 cursor-not-allowed'
            }`}
          >
            {!isSupported && (
              <Badge 
                variant="secondary" 
                className="absolute top-3 right-3 bg-muted text-muted-foreground text-xs"
              >
                <Lock className="h-3 w-3 mr-1" />
                Pro+
              </Badge>
            )}
            
            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 text-2xl`}>
              {category.icon}
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
            
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center"
              >
                <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
