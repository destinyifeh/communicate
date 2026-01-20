import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { FAQItem, generateId } from '@/lib/onboardingTypes';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQEditorProps {
  faqs: FAQItem[];
  onFaqsChange: (faqs: FAQItem[]) => void;
  minItems?: number;
}

export function FAQEditor({ faqs, onFaqsChange, minItems = 1 }: FAQEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [showAddForm, setShowAddForm] = useState(faqs.length === 0);

  const handleAddFAQ = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    
    const newFaq: FAQItem = {
      id: generateId(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    };
    
    onFaqsChange([...faqs, newFaq]);
    setNewQuestion('');
    setNewAnswer('');
    setShowAddForm(false);
  };

  const handleEditStart = (faq: FAQItem) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const handleEditSave = () => {
    if (!editingId || !editQuestion.trim() || !editAnswer.trim()) return;
    
    onFaqsChange(faqs.map(faq => 
      faq.id === editingId 
        ? { ...faq, question: editQuestion.trim(), answer: editAnswer.trim() }
        : faq
    ));
    setEditingId(null);
    setEditQuestion('');
    setEditAnswer('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditQuestion('');
    setEditAnswer('');
  };

  const handleDelete = (id: string) => {
    if (faqs.length <= minItems) return;
    onFaqsChange(faqs.filter(faq => faq.id !== id));
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">FAQ Questions & Answers</Label>
      
      <AnimatePresence mode="popLayout">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg border border-border bg-secondary/30"
          >
            {editingId === faq.id ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Question</Label>
                  <Input
                    value={editQuestion}
                    onChange={(e) => setEditQuestion(e.target.value)}
                    placeholder="Enter question"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Answer</Label>
                  <Textarea
                    value={editAnswer}
                    onChange={(e) => setEditAnswer(e.target.value)}
                    placeholder="Enter answer"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleEditCancel}
                    className="gap-1"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleEditSave}
                    className="gap-1"
                    disabled={!editQuestion.trim() || !editAnswer.trim()}
                  >
                    <Check className="h-3 w-3" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">Q{index + 1}</span>
                    <span className="font-medium text-sm truncate">{faq.question}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={() => handleEditStart(faq)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(faq.id)}
                    disabled={faqs.length <= minItems}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {showAddForm ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 space-y-3"
        >
          <div className="space-y-2">
            <Label className="text-xs">New Question</Label>
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="e.g., What are your opening hours?"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Answer</Label>
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="e.g., We are open Monday to Friday, 9am to 5pm."
              rows={2}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                setShowAddForm(false);
                setNewQuestion('');
                setNewAnswer('');
              }}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddFAQ}
              disabled={!newQuestion.trim() || !newAnswer.trim()}
              className="gradient-primary text-primary-foreground"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Question
            </Button>
          </div>
        </motion.div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="w-full border-dashed gap-2"
        >
          <Plus className="h-4 w-4" />
          Add More Questions
        </Button>
      )}
    </div>
  );
}