import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ProductItem, SalesOrderConfig, generateId } from '@/lib/businessTypes';
import { CreditCard, MessageSquare, Package, Plus, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';

interface SalesOrderSetupProps {
  config: SalesOrderConfig;
  onChange: (config: SalesOrderConfig) => void;
  onComplete: () => void;
}

export function SalesOrderSetup({ config, onChange, onComplete }: SalesOrderSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateConfig = (updates: Partial<SalesOrderConfig>) => {
    onChange({ ...config, ...updates });
  };

  const addProduct = () => {
    const newProduct: ProductItem = {
      id: generateId(),
      name: '',
      price: 0,
      description: '',
      inStock: true,
    };
    updateConfig({ products: [...config.products, newProduct] });
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    const newProducts = config.products.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    updateConfig({ products: newProducts });
  };

  const removeProduct = (id: string) => {
    updateConfig({ products: config.products.filter(p => p.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              i + 1 === currentStep
                ? 'bg-primary text-primary-foreground'
                : i + 1 < currentStep
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}>
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`h-1 w-8 sm:w-16 mx-1 transition-colors ${
                i + 1 < currentStep ? 'bg-primary/20' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Product Catalog */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Product Catalog
            </CardTitle>
            <CardDescription>Add your products or services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.products.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No products added yet</p>
                <Button variant="outline" className="mt-3 gap-2" onClick={addProduct}>
                  <Plus className="h-4 w-4" /> Add Product
                </Button>
              </div>
            )}

            {config.products.map((product, index) => (
              <div key={product.id} className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Product {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Name</Label>
                    <Input
                      placeholder="Product name"
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Price (₦)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={product.price || ''}
                      onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input
                    placeholder="Short description"
                    value={product.description}
                    onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id={`stock-${product.id}`}
                    checked={product.inStock}
                    onCheckedChange={(checked) => updateProduct(product.id, { inStock: checked })}
                  />
                  <Label htmlFor={`stock-${product.id}`} className="text-sm">In Stock</Label>
                </div>
              </div>
            ))}

            {config.products.length > 0 && (
              <Button variant="outline" className="w-full gap-2" onClick={addProduct}>
                <Plus className="h-4 w-4" /> Add Another Product
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Trigger & Messages */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Triggers & Messages
            </CardTitle>
            <CardDescription>Set up how customers interact with your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Trigger Keywords</Label>
              <Input
                placeholder="buy, order, price, how much"
                value={config.triggerKeywords.join(', ')}
                onChange={(e) => updateConfig({ 
                  triggerKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
              <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
            </div>

            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <Textarea
                rows={3}
                value={config.welcomeMessage}
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Order Confirmation Message</Label>
              <Textarea
                rows={3}
                value={config.orderConfirmationMessage}
                onChange={(e) => updateConfig({ orderConfirmationMessage: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Settings
            </CardTitle>
            <CardDescription>How will customers pay?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div>
                <div className="font-medium">Require Payment</div>
                <div className="text-sm text-muted-foreground">Collect payment before confirming orders</div>
              </div>
              <Switch
                checked={config.paymentRequired}
                onCheckedChange={(checked) => updateConfig({ paymentRequired: checked })}
              />
            </div>

            {config.paymentRequired && (
              <div className="space-y-2">
                <Label>Payment Methods</Label>
                <div className="flex flex-wrap gap-2">
                  {(['bank_transfer', 'card', 'ussd', 'crypto'] as const).map(method => (
                    <Badge
                      key={method}
                      variant={config.paymentMethods.includes(method) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => {
                        const newMethods = config.paymentMethods.includes(method)
                          ? config.paymentMethods.filter(m => m !== method)
                          : [...config.paymentMethods, method];
                        updateConfig({ paymentMethods: newMethods });
                      }}
                    >
                      {method.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Collect Customer Information</Label>
              <div className="flex flex-wrap gap-2">
                {(['name', 'phone', 'email', 'address'] as const).map(field => (
                  <Badge
                    key={field}
                    variant={config.collectCustomerInfo.includes(field) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      const newFields = config.collectCustomerInfo.includes(field)
                        ? config.collectCustomerInfo.filter(f => f !== field)
                        : [...config.collectCustomerInfo, field];
                      updateConfig({ collectCustomerInfo: newFields });
                    }}
                  >
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Delivery */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Delivery Options
            </CardTitle>
            <CardDescription>How will orders be fulfilled?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Delivery Options</Label>
              <div className="flex flex-wrap gap-2">
                {(['pickup', 'delivery'] as const).map(option => (
                  <Badge
                    key={option}
                    variant={config.deliveryOptions.includes(option) ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => {
                      const newOptions = config.deliveryOptions.includes(option)
                        ? config.deliveryOptions.filter(o => o !== option)
                        : [...config.deliveryOptions, option];
                      updateConfig({ deliveryOptions: newOptions });
                    }}
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            </div>

            {config.deliveryOptions.includes('delivery') && (
              <div className="space-y-2">
                <Label>Delivery Information Message</Label>
                <Textarea
                  rows={3}
                  placeholder="Delivery fee is ₦1,500 within Lagos..."
                  value={config.deliveryMessage || ''}
                  onChange={(e) => updateConfig({ deliveryMessage: e.target.value })}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        {currentStep < totalSteps ? (
          <Button
            onClick={() => setCurrentStep(prev => Math.min(totalSteps, prev + 1))}
          >
            Next Step
          </Button>
        ) : (
          <Button 
            className="gradient-primary text-primary-foreground"
            onClick={onComplete}
          >
            Complete Setup
          </Button>
        )}
      </div>
    </div>
  );
}
