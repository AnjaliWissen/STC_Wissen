// 'use client';

// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// interface AlertRuleDialogProps {
//   open: boolean;
//   onClose: () => void;
// }

// export function AlertRuleDialog({ open, onClose }: AlertRuleDialogProps) {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     name: '',
//     metric: 'tps',
//     condition: 'lt',
//     threshold: '',
//     severity: 'warning',
//   });

//   const createRuleMutation = useMutation({
//     mutationFn: async () => {
//       const { error } = await supabase.from('alert_rules').insert({
//         name: formData.name,
//         metric: formData.metric,
//         condition: formData.condition,
//         threshold: parseFloat(formData.threshold),
//         severity: formData.severity,
//         enabled: true,
//         created_by: 'System Admin',
//       });

//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
//       setFormData({
//         name: '',
//         metric: 'tps',
//         condition: 'lt',
//         threshold: '',
//         severity: 'warning',
//       });
//       onClose();
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     createRuleMutation.mutate();
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create Alert Rule</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Rule Name</Label>
//             <Input
//               id="name"
//               placeholder="e.g., Low TPS Alert"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="metric">Metric</Label>
//             <Select
//               value={formData.metric}
//               onValueChange={(value) => setFormData({ ...formData, metric: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="tps">Transactions Per Second</SelectItem>
//                 <SelectItem value="latency">Latency</SelectItem>
//                 <SelectItem value="cpu_usage">CPU Usage</SelectItem>
//                 <SelectItem value="memory_usage">Memory Usage</SelectItem>
//                 <SelectItem value="storage_usage">Storage Usage</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="condition">Condition</Label>
//               <Select
//                 value={formData.condition}
//                 onValueChange={(value) => setFormData({ ...formData, condition: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="gt">Greater Than</SelectItem>
//                   <SelectItem value="lt">Less Than</SelectItem>
//                   <SelectItem value="eq">Equal To</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="threshold">Threshold</Label>
//               <Input
//                 id="threshold"
//                 type="number"
//                 step="0.01"
//                 placeholder="0.00"
//                 value={formData.threshold}
//                 onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="severity">Severity</Label>
//             <Select
//               value={formData.severity}
//               onValueChange={(value) => setFormData({ ...formData, severity: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="info">Info</SelectItem>
//                 <SelectItem value="warning">Warning</SelectItem>
//                 <SelectItem value="critical">Critical</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="purple" disabled={createRuleMutation.isPending}>
//               {createRuleMutation.isPending ? 'Creating...' : 'Create Rule'}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }


'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BASE_URL =
  'http://ec2-13-202-153-162.ap-south-1.compute.amazonaws.com:3000';

interface AlertRuleDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AlertRuleDialog({ open, onClose }: AlertRuleDialogProps) {
  const [config, setConfig] = useState({
    cpu: { enabled: true, threshold: 0 },
    memory: { enabled: true, threshold: 0 },
    stuckTransactions: { timeoutMinutes: 0 },
    lowBalance: { thresholdKWD: 0, thresholdBHD: 0 },
    failedTransactions: { countThreshold: 0 },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/api/alerts/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error('Failed to update alert configuration');
      }

      return res.json();
    },
    onSuccess: (data) => {
      alert(data.message);
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfigMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="
          rounded-lg border 
          bg-background text-foreground
          shadow-lg

          dark:bg-gradient-to-br 
          dark:from-gray-800 
          dark:to-gray-900/50
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Alert Configuration
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">

            {/* CPU */}
            <div className="space-y-2">
              <Label className="text-foreground">
                CPU Threshold (%)
              </Label>

              <Input
                type="number"
                min={0}
                value={config.cpu.threshold}
                className="
                  h-11 rounded-lg
                  bg-background
                  border border-input
                  text-foreground
                  placeholder:text-muted-foreground

                  dark:bg-white/5 
                  dark:border-white/10 
                  dark:text-white 
                  dark:placeholder:text-slate-400

                  focus:border-primary
                  focus:ring-2 focus:ring-primary/20
                  transition
                "
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    cpu: {
                      ...p.cpu,
                      threshold: e.target.valueAsNumber || 0,
                    },
                  }))
                }
              />
            </div>

            {/* MEMORY */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Memory Threshold (%)
              </Label>

              <Input
                type="number"
                min={0}
                value={config.memory.threshold}
                className="
                  h-11 rounded-lg
                  bg-background
                  border border-input
                  text-foreground
                  placeholder:text-muted-foreground

                  dark:bg-white/5 
                  dark:border-white/10 
                  dark:text-white

                  focus:border-primary
                  focus:ring-2 focus:ring-primary/20
                  transition
                "
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    memory: {
                      ...p.memory,
                      threshold: e.target.valueAsNumber || 0,
                    },
                  }))
                }
              />
            </div>

            {/* STUCK TRANSACTIONS */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Stuck Transactions Timeout (minutes)
              </Label>

              <Input
                type="number"
                min={0}
                value={config.stuckTransactions.timeoutMinutes}
                className="
                  h-11 rounded-lg
                  bg-background border border-input
                  text-foreground
                  dark:bg-white/5 dark:border-white/10
                "
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    stuckTransactions: {
                      timeoutMinutes: e.target.valueAsNumber || 0,
                    },
                  }))
                }
              />
            </div>

            {/* FAILED TRANSACTIONS */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Failed Transactions Count
              </Label>

              <Input
                type="number"
                min={0}
                value={config.failedTransactions.countThreshold}
                className="
                  h-11 rounded-lg
                  bg-background border border-input
                  text-foreground
                  dark:bg-white/5 dark:border-white/10
                "
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    failedTransactions: {
                      countThreshold: e.target.valueAsNumber || 0,
                    },
                  }))
                }
              />
            </div>

            {/* LOW BALANCE KWD */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Low Balance Threshold (KWD)
              </Label>

              <Input
                type="number"
                min={0}
                value={config.lowBalance.thresholdKWD}
                className="
                  h-11 rounded-lg
                  bg-background border border-input
                  text-foreground
                  dark:bg-white/5 dark:border-white/10
                "
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    lowBalance: {
                      ...p.lowBalance,
                      thresholdKWD: e.target.valueAsNumber || 0,
                    },
                  }))
                }
              />
            </div>

            {/* LOW BALANCE BHD */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Low Balance Threshold (BHD)
              </Label>

              <Input
                type="number"
                min={0}
                value={config.lowBalance.thresholdBHD}
                className="
                  h-11 rounded-lg
                  bg-background border border-input
                  text-foreground
                  dark:bg-white/5 dark:border-white/10
                "
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    lowBalance: {
                      ...p.lowBalance,
                      thresholdBHD: e.target.valueAsNumber || 0,
                    },
                  }))
                }
              />
            </div>

          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              className="
                border-input text-foreground
                hover:bg-accent hover:text-accent-foreground

                dark:border-white/20 
                dark:text-white 
                dark:hover:bg-white/10
              "
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="
                bg-primary text-primary-foreground
                hover:bg-primary/90
              "
              disabled={updateConfigMutation.isPending}
            >
              {updateConfigMutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
 