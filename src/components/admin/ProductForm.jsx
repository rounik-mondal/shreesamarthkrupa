'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/lib/ToastContext';

export default function ProductForm({ initialData }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    basePrice: initialData?.basePrice || '',
    category: initialData?.category || 'SOFA',
    inStock: initialData?.inStock ?? true,
    images: initialData?.images || [''],
    options: initialData?.options || { steps: [] }
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/admin/products/${initialData.id}` : '/api/admin/products';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save product');
      toast.success('Product saved successfully');
      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save product');
      setLoading(false);
    }
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      options: {
        steps: [
          ...(prev.options.steps || []),
          { id: `step_${Date.now()}`, name: '', type: 'select', choices: [] }
        ]
      }
    }));
  };

  const removeStep = (index) => {
    const newSteps = [...formData.options.steps];
    newSteps.splice(index, 1);
    setFormData(prev => ({ ...prev, options: { steps: newSteps } }));
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...formData.options.steps];
    newSteps[index][field] = value;
    setFormData(prev => ({ ...prev, options: { steps: newSteps } }));
  };

  const addChoice = (stepIndex) => {
    const newSteps = [...formData.options.steps];
    newSteps[stepIndex].choices.push({ value: '', label: '', price: 0, image: '' });
    setFormData(prev => ({ ...prev, options: { steps: newSteps } }));
  };

  const removeChoice = (stepIndex, choiceIndex) => {
    const newSteps = [...formData.options.steps];
    newSteps[stepIndex].choices.splice(choiceIndex, 1);
    setFormData(prev => ({ ...prev, options: { steps: newSteps } }));
  };

  const updateChoice = (stepIndex, choiceIndex, field, value) => {
    const newSteps = [...formData.options.steps];
    newSteps[stepIndex].choices[choiceIndex][field] = value;
    setFormData(prev => ({ ...prev, options: { steps: newSteps } }));
  };

  const handleTextureUpload = async (e, stepIndex, choiceIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      if (data.url) {
        updateChoice(stepIndex, choiceIndex, 'image', data.url);
      }
    } catch (err) {
      toast.error("Failed to upload texture");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-xl font-serif text-royal-900 mb-4">Basic Details</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 p-2 rounded">
              <option value="SOFA">Sofa</option>
              <option value="WALLPAPER">Wallpaper</option>
              <option value="PILLOW">Pillow</option>
              <option value="BLANKET">Blanket</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 p-2 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
            <input required type="number" min="0" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} className="w-full border border-gray-300 p-2 rounded" />
          </div>
          <div className="flex items-center mt-6">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({...formData, inStock: e.target.checked})} className="mr-2 h-5 w-5 rounded border-gray-300" />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
          <input required type="text" value={formData.images[0] || ''} onChange={e => setFormData({...formData, images: [e.target.value]})} className="w-full border border-gray-300 p-2 rounded" placeholder="https://..." />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif text-royal-900">Customization Steps</h2>
          <button type="button" onClick={addStep} className="text-sm bg-royal-100 text-royal-900 px-3 py-1 rounded flex items-center gap-1">
            <Plus size={16} /> Add Step
          </button>
        </div>

        <div className="space-y-6">
          {formData.options.steps.map((step, stepIndex) => (
            <div key={step.id} className="border border-gray-200 p-4 rounded bg-gray-50">
              <div className="flex justify-between mb-4">
                <div className="flex gap-4 flex-1 mr-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Step Name (e.g., Fabric)</label>
                    <input type="text" value={step.name} onChange={e => updateStep(stepIndex, 'name', e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                    <select value={step.type} onChange={e => updateStep(stepIndex, 'type', e.target.value)} className="w-full border border-gray-300 p-2 rounded text-sm">
                      <option value="select">Select (Choices)</option>
                      <option value="measurement">Measurement (Sq.Ft)</option>
                    </select>
                  </div>
                </div>
                <button type="button" onClick={() => removeStep(stepIndex)} className="text-red-500 hover:bg-red-50 p-2 rounded mt-4">
                  <Trash2 size={18} />
                </button>
              </div>

              {step.type === 'select' && (
                <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">Choices</h4>
                    <button type="button" onClick={() => addChoice(stepIndex)} className="text-xs bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                      <Plus size={14} /> Add Choice
                    </button>
                  </div>
                  {step.choices.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className="flex items-center gap-2 bg-white p-2 border border-gray-200 rounded">
                      <input type="text" placeholder="Value (e.g. red_velvet)" value={choice.value} onChange={e => updateChoice(stepIndex, choiceIndex, 'value', e.target.value)} className="flex-1 border p-1 rounded text-sm" />
                      <input type="text" placeholder="Label (e.g. Red Velvet)" value={choice.label} onChange={e => updateChoice(stepIndex, choiceIndex, 'label', e.target.value)} className="flex-1 border p-1 rounded text-sm" />
                      <input type="number" placeholder="+ Price" value={choice.price || ''} onChange={e => updateChoice(stepIndex, choiceIndex, 'price', parseFloat(e.target.value) || 0)} className="w-24 border p-1 rounded text-sm" />
                      
                      <div className="relative">
                        <input type="file" id={`texture-${stepIndex}-${choiceIndex}`} className="hidden" accept="image/*" onChange={e => handleTextureUpload(e, stepIndex, choiceIndex)} />
                        <label htmlFor={`texture-${stepIndex}-${choiceIndex}`} className="cursor-pointer bg-gray-100 p-1.5 rounded hover:bg-gray-200 block" title="Upload Texture">
                          <ImageIcon size={16} className="text-gray-600" />
                        </label>
                      </div>
                      
                      {choice.image && <img src={choice.image} alt="texture" className="w-6 h-6 object-cover rounded border" />}
                      
                      <button type="button" onClick={() => removeChoice(stepIndex, choiceIndex)} className="text-red-500 p-1"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              )}

              {step.type === 'measurement' && (
                <div className="ml-4 pl-4 border-l-2 border-gray-200 grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Min Width</label>
                    <input type="number" value={step.validation?.minWidth || ''} onChange={e => updateStep(stepIndex, 'validation', {...step.validation, minWidth: parseInt(e.target.value)})} className="w-full border p-1 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Max Width</label>
                    <input type="number" value={step.validation?.maxWidth || ''} onChange={e => updateStep(stepIndex, 'validation', {...step.validation, maxWidth: parseInt(e.target.value)})} className="w-full border p-1 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
                    <input type="text" value={step.validation?.unit || 'sqft'} onChange={e => updateStep(stepIndex, 'validation', {...step.validation, unit: e.target.value})} className="w-full border p-1 rounded text-sm" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-gold-500 text-white font-bold py-3 rounded hover:bg-gold-600 transition flex justify-center">
        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Save Product'}
      </button>
    </form>
  );
}
