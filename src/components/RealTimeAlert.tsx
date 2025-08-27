// Real-Time Alert System for Immediate Threat Warnings
// Provides non-intrusive but obvious warnings about detected threats

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, X, ExternalLink, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface ThreatAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  category: string;
  url: string;
  riskScore: number;
  triggeredFeatures: string[];
  explanation: string;
  timestamp: Date;
  acknowledged?: boolean;
}

interface RealTimeAlertProps {
  alert: ThreatAlert;
  onAcknowledge: (alertId: string) => void;
  onViewDetails: (alertId: string) => void;
  position?: 'top' | 'bottom' | 'center';
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const RealTimeAlert: React.FC<RealTimeAlertProps> = ({
  alert,
  onAcknowledge,
  onViewDetails,
  position = 'top',
  autoHide = false,
  autoHideDelay = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onAcknowledge(alert.id);
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, alert.id, onAcknowledge]);

  if (!isVisible || alert.acknowledged) {
    return null;
  }

  const getAlertStyles = () => {
    switch (alert.type) {
      case 'danger':
        return {
          containerClass: 'border-destructive bg-destructive/10',
          iconColor: 'text-destructive',
          badgeVariant: 'destructive' as const
        };
      case 'warning':
        return {
          containerClass: 'border-orange-500 bg-orange-50 dark:bg-orange-950/30',
          iconColor: 'text-orange-500',
          badgeVariant: 'secondary' as const
        };
      case 'info':
        return {
          containerClass: 'border-security-primary bg-security-primary/10',
          iconColor: 'text-security-primary',
          badgeVariant: 'outline' as const
        };
      default:
        return {
          containerClass: 'border-border bg-background',
          iconColor: 'text-foreground',
          badgeVariant: 'outline' as const
        };
    }
  };

  const getPositionStyles = () => {
    const baseStyles = 'fixed left-4 right-4 z-50 mx-auto max-w-lg';
    
    switch (position) {
      case 'top':
        return `${baseStyles} top-4`;
      case 'bottom':
        return `${baseStyles} bottom-4`;
      case 'center':
        return `${baseStyles} top-1/2 -translate-y-1/2`;
      default:
        return `${baseStyles} top-4`;
    }
  };

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'danger':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-destructive';
    if (score >= 60) return 'text-orange-500';
    if (score >= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  const styles = getAlertStyles();

  return (
    <div className={getPositionStyles()}>
      <Card className={`${styles.containerClass} shadow-lg animate-in slide-in-from-top-2 duration-300`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={styles.iconColor}>
                {getAlertIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-semibold">
                  Security Alert: {alert.category}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {new URL(alert.url).hostname}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={styles.badgeVariant} className="text-xs">
                  Risk: <span className={getRiskColor(alert.riskScore)}>{alert.riskScore}</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setIsVisible(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm text-foreground">
              {alert.explanation}
            </div>

            {!isExpanded && alert.triggeredFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {alert.triggeredFeatures.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {alert.triggeredFeatures.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-2 text-xs"
                    onClick={() => setIsExpanded(true)}
                  >
                    +{alert.triggeredFeatures.length - 3} more
                  </Button>
                )}
              </div>
            )}

            {isExpanded && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  Triggered Security Features:
                </div>
                <div className="flex flex-wrap gap-1">
                  {alert.triggeredFeatures.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-2 text-xs"
                  onClick={() => setIsExpanded(false)}
                >
                  Show less
                </Button>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8"
                onClick={() => onViewDetails(alert.id)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Details
              </Button>
              <Button
                size="sm"
                variant="default"
                className="flex-1 text-xs h-8"
                onClick={() => {
                  setIsVisible(false);
                  onAcknowledge(alert.id);
                }}
              >
                <Shield className="h-3 w-3 mr-1" />
                Acknowledge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Alert Manager Component for handling multiple alerts
interface AlertManagerProps {
  alerts: ThreatAlert[];
  onAcknowledge: (alertId: string) => void;
  onViewDetails: (alertId: string) => void;
  maxSimultaneousAlerts?: number;
}

export const AlertManager: React.FC<AlertManagerProps> = ({
  alerts,
  onAcknowledge,
  onViewDetails,
  maxSimultaneousAlerts = 3
}) => {
  const activeAlerts = alerts
    .filter(alert => !alert.acknowledged)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, maxSimultaneousAlerts);

  return (
    <>
      {activeAlerts.map((alert, index) => (
        <RealTimeAlert
          key={alert.id}
          alert={alert}
          onAcknowledge={onAcknowledge}
          onViewDetails={onViewDetails}
          position={index === 0 ? 'top' : 'top'}
          autoHide={alert.type === 'info'}
          autoHideDelay={alert.type === 'info' ? 5000 : 0}
        />
      ))}
    </>
  );
};

// Hook for managing real-time alerts
export const useRealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);

  const addAlert = (alert: Omit<ThreatAlert, 'id' | 'timestamp'>) => {
    const newAlert: ThreatAlert = {
      ...alert,
      id: Math.random().toString(36).substring(2),
      timestamp: new Date()
    };
    
    setAlerts(prev => [...prev, newAlert]);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => !alert.acknowledged);
  };

  return {
    alerts,
    addAlert,
    acknowledgeAlert,
    clearAllAlerts,
    getActiveAlerts
  };
};