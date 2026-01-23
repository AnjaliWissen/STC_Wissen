'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Configure monitoring and notification preferences</p>
      </div>

      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive alerts via email</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Critical Alerts Only</Label>
              <p className="text-sm text-gray-500">Only notify for critical severity alerts</p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Real-time Dashboard Updates</Label>
              <p className="text-sm text-gray-500">Auto-refresh dashboard every 10 seconds</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Configure system-wide monitoring settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Metrics Retention (days)</Label>
              <Input type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label>Alert Retention (days)</Label>
              <Input type="number" defaultValue="90" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Default Refresh Interval (seconds)</Label>
            <Input type="number" defaultValue="10" />
          </div>

          <Button variant="purple" className="mt-4">Save Configuration</Button>
        </CardContent>
      </Card>

      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle>Network Endpoints</CardTitle>
          <CardDescription>Configure blockchain network connection endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Hyperledger Fabric Peer Endpoint</Label>
            <Input placeholder="grpcs://peer0.org1.example.com:7051" />
          </div>

          <div className="space-y-2">
            <Label>Stellar Horizon API Endpoint</Label>
            <Input placeholder="https://horizon.stellar.org" />
          </div>

          <div className="space-y-2">
            <Label>Bridge Service Endpoint</Label>
            <Input placeholder="https://bridge.example.com" />
          </div>

          <Button variant="purple" className="mt-4">Update Endpoints</Button>
        </CardContent>
      </Card>

      <Card className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
        <CardHeader>
          <CardTitle>User Access</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Engineering Team</div>
                <div className="text-sm text-gray-500">Full access to all monitoring features</div>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Operations Team</div>
                <div className="text-sm text-gray-500">Access to dashboards and alerts</div>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Compliance Team</div>
                <div className="text-sm text-gray-500">Read-only access with audit log exports</div>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
