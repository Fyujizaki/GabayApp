import React from 'react';
import { Icons, Button, Card } from '../ui/SharedComponents';

const RewardsView = ({ userPoints, inventory, handleRedeem }) => {
    const REWARDS = [
        { id: 'theme_premium', name: "Premium Profile Theme", cost: 500, icon: Icons.Sparkles, desc: "Unlocks a gold border and special background for your profile." },
        { id: 'coaching_session', name: "Career Coaching Session", cost: 300, icon: Icons.User, desc: "One-on-one simulation with a career expert." },
        { id: 'resume_pack', name: "Pro Resume Templates", cost: 150, icon: Icons.BookOpen, desc: "Unlock 3 professional resume formats." }
    ];

    return (
        <div className="space-y-6 p-6 pb-24 overflow-y-auto h-full">
            <div className="bg-barong-navy text-barong-gold p-6 rounded-2xl shadow-lg flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-serif">Rewards Shop</h2>
                    <p className="text-barong-cream/80 text-sm">Spend your hard-earned tokens.</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold">{userPoints}</div>
                    <div className="text-xs uppercase tracking-wider opacity-75">Available Points</div>
                </div>
            </div>

            <div className="grid gap-4">
                {REWARDS.map(reward => {
                    const isOwned = inventory.includes(reward.id);
                    const canAfford = userPoints >= reward.cost;
                    return (
                        <Card key={reward.id} className="flex items-center gap-4 relative overflow-hidden">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${isOwned ? 'bg-green-100 text-green-600' : 'bg-barong-gold/20 text-barong-navy'}`}>
                                <reward.icon />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-barong-navy dark:text-barong-cream">{reward.name}</h3>
                                <p className="text-xs text-slate-500 mb-2">{reward.desc}</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-barong-gold">{reward.cost} Pts</span>
                                    {isOwned && <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">Owned</span>}
                                </div>
                            </div>
                            <Button 
                                onClick={() => handleRedeem(reward)} 
                                disabled={isOwned || !canAfford} 
                                variant={isOwned ? "outline" : "primary"}
                                className={`text-xs px-3 ${isOwned ? 'opacity-50' : ''}`}
                            >
                                {isOwned ? "Redeemed" : "Redeem"}
                            </Button>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default RewardsView;
